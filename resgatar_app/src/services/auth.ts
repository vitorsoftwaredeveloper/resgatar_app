// src/services/auth.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENV } from "@/config/env";

const COGNITO_DOMAIN = ENV.API_BASE_URL_AUTH;
const USER_POOL_ID = "us-east-1_GQLSR1iCt";
const CLIENT_ID = "5o6l8ipka69bhoia4b8lk3554g";

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${COGNITO_DOMAIN}/`,
      {
        AuthFlow: "ADMIN_NO_SRP_AUTH",
        ClientId: CLIENT_ID,
        UserPoolId: USER_POOL_ID,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      },
      {
        headers: {
          "X-Amz-Target": "AWSCognitoIdentityProviderService.AdminInitiateAuth",
          "Content-Type": "application/x-amz-json-1.1",
        },
      }
    );

    const { AccessToken, IdToken, RefreshToken } =
      response.data.AuthenticationResult;

    await AsyncStorage.setItem("accessToken", AccessToken);
    await AsyncStorage.setItem("idToken", IdToken);
    await AsyncStorage.setItem("refreshToken", RefreshToken);

    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const logout = async () => {
  await AsyncStorage.multiRemove(["accessToken", "idToken", "refreshToken"]);
};

export const isAuthenticated = async () => {
  const token = await AsyncStorage.getItem("accessToken");
  return !!token;
};
