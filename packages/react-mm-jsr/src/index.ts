import JSR from 'mm-jsr';
import React, { useEffect, useRef, useState } from 'react';

type Ctor = ConstructorParameters<typeof JSR>[0];
type Config = Omit<Ctor['config'], 'container'>;
type Modules = Ctor['modules'];

export interface Props {
  className?: string;
  config: Config;
  modules: Modules;
}

export const useJSR = ({
  className,
  config,
  modules,
}: Props) => {
  const containerRef = useRef<HTMLElement>();
  const [jsr, setJsr] = useState<JSR>();

  useEffect(() => {
    setJsr(new JSR({
      config: {
        container: containerRef.current!,
        ...config,
      },
      modules,
    }));

    return () => {
      jsr!.destroy();
    };
  }, []);

  return {
    JSR: React.createElement('div', {
      className,
      ref: containerRef,
    }, null),
    instance: jsr,
  };
};

