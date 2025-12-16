import React from "react";
import { TouchableOpacity, Text, ButtonProps } from "react-native";
import { styles } from "./styles";

type Props = ButtonProps & {
  title: string;
  backgroundColor?: string;
  children?: React.ReactNode;
  styleCustom?: any;
};

export function Button({ title, ...rest }: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        rest.styleCustom && rest.styleCustom,
        rest.backgroundColor && { backgroundColor: rest.backgroundColor },
      ]}
      {...rest}
    >
      {title && <Text style={styles.buttonText}>{title}</Text>}
      {rest.children && rest.children}
    </TouchableOpacity>
  );
}
