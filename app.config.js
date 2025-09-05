// app.config.js (replace app.json)
export default ({ config }) => {
  const baseConfig = {
    name: "Cost Tracker",
    slug: "APL-Pengeluaran",
    owner: "ardi_expo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/ic_launcher.png",
    scheme: "aplpengeluaran",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.ardiexpo.aplpengeluaran"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/ic_launcher.png",
        backgroundColor: "#ffffff"
      },
      package: "com.ardiexpo.aplpengeluaran",
      edgeToEdgeEnabled: true
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash.png",
          imageWidth: 200,
          resizeMode: "contain"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "e60c41b1-71ea-4a3a-8b3c-1cf648818950"
      }
    }
  };

  // Different packages based on build profile
  if (process.env.EAS_BUILD_PROFILE === 'development') {
    baseConfig.android.package = "com.ardiexpo.aplpengeluaran.dev";
    baseConfig.name = "Cost Tracker DEV";
  } else if (process.env.EAS_BUILD_PROFILE === 'preview') {
    baseConfig.android.package = "com.ardiexpo.aplpengeluaran.preview";
    baseConfig.name = "Cost Tracker PREVIEW";
  }

  return baseConfig;
};