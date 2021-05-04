import JSR from 'mm-jsr';
import React, { useEffect, useRef } from 'react';

type Ctor = ConstructorParameters<typeof JSR>[0];
type Config = Omit<Ctor['config'], 'container'>;
type Modules = Ctor['modules'];

export interface Props {
  className?: string;
  config: Config;
  modules: Modules;
  disabled?: boolean;
  onChange?: ((v: { index: number, real: number, ratio: number }) => void);
}

export const useJSR = ({
  className,
  config,
  modules,
  disabled,
  onChange,
}: Props) => {
  const containerRef = useRef<HTMLElement>();
  const jsrRef = useRef<JSR>();

  /** Destroy on unmount */
  useEffect(() => {
    if (jsrRef.current) {
      jsrRef.current.destroy();
    }
  }, []);

  /** Register JSR */
  useEffect(() => {
    if (containerRef.current) {
      jsrRef.current = new JSR({
        config: {
          container: containerRef.current,
          ...config,
        },
        modules,
      });

      jsrRef.current.onValueChange(v => {
        if (onChange) {
          onChange(v);
        }
      });
    }
  }, []);

  /**
   * Add disabled handler
   */
  useEffect(() => {
    if (!jsrRef.current) {
      return;
    }

    if (disabled) {
      jsrRef.current.disable();
    } else {
      jsrRef.current.enable();
    }
  }, [disabled, jsrRef.current]);

  return {
    JSR: React.createElement('div', {
      className,
      ref: containerRef,
    }, null),
    instance: jsrRef.current,
  };
};

