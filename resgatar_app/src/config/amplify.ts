import { Amplify } from "aws-amplify";
import AsyncStorage from "@react-native-async-storage/async-storage";

Amplify.configure({
  Auth: {
    storage: AsyncStorage,
    Cognito: {
      userPoolId: "us-east-1_XXXXXXXXX",
      userPoolClientId: "YYYYYYYYYYYYYYYY",

      // 👇 ISSO RESOLVE O ERRO
      loginWith: {
        email: true,
      },
    },
  },
});
