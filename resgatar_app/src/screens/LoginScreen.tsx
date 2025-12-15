import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export const  LoginScreen = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleChange = (name: string, value: string) => {
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const router = useRouter(); 

//   const handleLogin = async () => {
//     console.log({credentials});
//     await ChargesService.signin(credentials).then((response) => {
//     console.log({response});
//   }).catch((error) => {
//     console.log({error});
//   });
//   }
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá!</Text>
      <Input
        placeholder="Digite seu email"
        keyboardType='email-address'
        onChangeText={(email) => handleChange('email', email)}
      />
      <Input
        placeholder="Digite seu nome"
        keyboardType='visible-password'
        onChangeText={(password) => handleChange('password', password)}
      />
      <Button
        title="Entrar"
        // onPress={handleLogin}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#19181F',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#453467',
  },
});