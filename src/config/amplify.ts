import {
  COGNITO_USER_POOL_ID,
  COGNITO_USER_POOL_CLIENT_ID,
  COGNITO_REGION,
} from "@env";
import { Amplify } from "aws-amplify";

const config = {
  Auth: {
    Cognito: {
      userPoolId: COGNITO_USER_POOL_ID,
      userPoolClientId: COGNITO_USER_POOL_CLIENT_ID,
      region: COGNITO_REGION,
      loginWith: {
        username: true,
      },
      userPoolEndpoint: undefined,
    },
  },
};

Amplify.configure(config);

export default Amplify;
