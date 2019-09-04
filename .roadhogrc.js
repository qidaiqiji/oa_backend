// ["transform-remove-console", { "exclude": [ "error", "warn"] }]
export default {
  // devtool:false,
  entry: "src/index.js",
  extraBabelPlugins: [
    "transform-runtime",
    "transform-decorators-legacy",
    "transform-class-properties",
    ["import", { libraryName: "antd", libraryDirectory: "es", style: true }],

  ],
  env: {
    development: {
      extraBabelPlugins: [
        "dva-hmr"
      ]
    },
    
  },
  define: {
    "API_ENV": process.env.API_ENV
  },
  externals: {
    "g2": "G2",
    "g-cloud": "Cloud",
    // "g2-plugin-slider": "G2.Plugin.slider"
  },
  ignoreMomentLocale: true,
  disableDynamicImport:false,
  theme: "./src/theme.js",
  hash: true
}
