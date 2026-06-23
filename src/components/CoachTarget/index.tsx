import React, { useEffect, useRef } from "react";
import { View, ViewProps } from "react-native";
import { useCoach } from "@/context/CoachContext";

interface Props extends ViewProps {
  id: string;
  children: React.ReactNode;
}

/**
 * Envolve um elemento para que o tour de coach-marks consiga medi-lo na tela.
 * Uso: <CoachTarget id="tab-bills"><...></CoachTarget>
 */
export function CoachTarget({ id, children, ...rest }: Props) {
  const ref = useRef<View>(null);
  const { register, unregister } = useCoach();

  useEffect(() => {
    register(id, (cb) => {
      if (!ref.current) return;
      ref.current.measureInWindow((x, y, width, height) => {
        cb({ x, y, width, height });
      });
    });
    return () => unregister(id);
  }, [id, register, unregister]);

  return (
    <View ref={ref} collapsable={false} {...rest}>
      {children}
    </View>
  );
}
