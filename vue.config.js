module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      build: {
        appId: "com.d9beud.pdf-masker",
        mac: {
          category: "public.app-category.utilities",
          target: "dmg",
          icon: "build/icons/256x256.icns",
          darkModeSupport: true,
          electronLanguage: ["en-US", "fr-FR"],
        },
        win: {
          target: ["nsis", "portable"],
          icon: "build/icons/icon.ico",
          perMachine: true,
        },
      },
    },
  },
};
