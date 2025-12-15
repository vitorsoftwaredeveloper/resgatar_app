import React from 'react';
import { TouchableOpacity, Text, ButtonProps } from 'react-native'; 
import { styles } from './styles'; 

type Props =   ButtonProps & { 
  title: string;
}

export function Button({ title, onPress, ...rest }: Props) {
  return (
    <TouchableOpacity style={styles.button}  onPress={onPress} {...rest}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}