const ENV = process.env.APP_ENV ?? "hml";
const googleServicesFile =
  process.env.GOOGLE_SERVICES_JSON ?? // EAS injeta o caminho do secret
  (ENV === "production"
    ? "./google-services.prod.json"
    : "./google-services.hml.json");

module.exports = {
  expo: {
    name: "Resgatar",
    slug: "resgatar_app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "light",
    jsEngine: "hermes",
    ios: {
      bundleIdentifier: "com.vitorsoftwaredeveloper.resgatar.app",
      supportsTablet: true,
    },
    android: {
      package: "com.vitorsoftwaredeveloper.resgatar_app",
      versionCode: 5,
      adaptiveIcon: {
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundColor: "#F5F0E8",
      },
      googleServicesFile,
    },
    plugins: [
      "expo-dev-client",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash2.png",
          imageWidth: 400,
          resizeMode: "contain",
        },
      ],
      "expo-font",
      "expo-secure-store",
      "@react-native-firebase/app",
      [
        "expo-notifications",
        {
          icon: "./assets/images/icon.png",
          color: "#6B3F1E",
          defaultChannel: "default",
        },
      ],
      "./firebaseMessagingFix",
    ],
    extra: {
      eas: {
        projectId: "5fa8ea09-d47b-497b-992c-9f1704fb0613",
      },
    },
  },
};
