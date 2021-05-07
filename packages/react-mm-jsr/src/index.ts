import JSR from 'mm-jsr';
import React, { useEffect, useRef, useState } from 'react';

type Ctor = ConstructorParameters<typeof JSR>[0];
type Config = Omit<Ctor['config'], 'container'>;
type Modules = Ctor['modules'];

export interface Props {
  className?: string;
  config: Config;
  modules: Modules;
  onChange?: ((v: { index: number, real: number, ratio: number }) => void);
}

export const useJSR = ({
  className,
  config,
  modules,
  onChange,
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

  /** Register JSR */
  useEffect(() => {
    if (jsr && onChange) {
      return jsr.onValueChange(v => {
        onChange(v);
      });
    }
  }, [jsr, onChange]);

  return {
    JSR: React.createElement('div', {
      className,
      ref: containerRef,
    }, null),
    instance: jsr,
  };
};

