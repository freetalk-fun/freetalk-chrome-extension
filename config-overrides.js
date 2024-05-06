const { override } = require("customize-cra");

const overrideEntry = (config) => {
  config.entry = {
    main: "./src/popup", // the extension UI
    background: "./src/background",
    content: "./src/content",
  };

  config.devServer = {
    devMiddleware: {
      writeToDisk: true,
    },
  };

  return config;
};

const overrideOutput = (config) => {
  config.output = {
    ...config.output,
    filename: "static/js/[name].js",
    chunkFilename: "static/js/[name].js",
  };

  return config;
};

module.exports = {
  webpack: (config) => override(overrideEntry, overrideOutput)(config),
};
