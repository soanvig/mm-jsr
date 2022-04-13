import { JSR } from 'mm-jsr';
import { useEffect, useRef, useState } from 'react';

type Ctor = ConstructorParameters<typeof JSR>[0];
type Config = Omit<Ctor['config'], 'container'>;
type Modules = Ctor['modules'];

export interface ReactJSRParams {
  config: Config;
  modules: Modules;
}

export const useJSR = ({
  config,
  modules,
}: ReactJSRParams) => {
  const containerRef = useRef<HTMLElement>();
  const [jsr, setJsr] = useState<JSR | null>(null);

  useEffect(() => {
    if (containerRef.current && !jsr) {
      setJsr(new JSR({
        config: {
          container: containerRef.current,
          ...config,
        },
        modules,
      }));
    }
  }, [containerRef.current]);

  useEffect(() => {
    return () => {
      if (jsr) {
        jsr.destroy();
        setJsr(null);
      }
    };
  }, []);

  return {
    ref: containerRef,
    instance: jsr,
  };
};

