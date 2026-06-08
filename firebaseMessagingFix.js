const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withFirebaseMessagingFix(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;

    // Garante o namespace tools no elemento <manifest>
    if (!manifest.manifest.$) {
      manifest.manifest.$ = {};
    }
    manifest.manifest.$["xmlns:tools"] = "http://schemas.android.com/tools";

    const application = manifest.manifest.application?.[0];
    if (!application) return config;

    if (!application["meta-data"]) {
      application["meta-data"] = [];
    }

    const metaData = application["meta-data"];

    const channelIndex = metaData.findIndex(
      (m) =>
        m.$?.["android:name"] ===
        "com.google.firebase.messaging.default_notification_channel_id",
    );

    if (channelIndex >= 0) {
      metaData[channelIndex].$["tools:replace"] = "android:value";
    } else {
      metaData.push({
        $: {
          "android:name":
            "com.google.firebase.messaging.default_notification_channel_id",
          "android:value": "default",
          "tools:replace": "android:value",
        },
      });
    }

    const colorIndex = metaData.findIndex(
      (m) =>
        m.$?.["android:name"] ===
        "com.google.firebase.messaging.default_notification_color",
    );

    if (colorIndex >= 0) {
      metaData[colorIndex].$["tools:replace"] = "android:resource";
    } else {
      metaData.push({
        $: {
          "android:name":
            "com.google.firebase.messaging.default_notification_color",
          "android:resource": "@color/notification_icon_color",
          "tools:replace": "android:resource",
        },
      });
    }

    return config;
  });
};
