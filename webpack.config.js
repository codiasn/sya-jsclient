const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "lib"),
    filename: "xya-jsclient.js",
    library: {
      name: "XyaJsClient",
      type: "umd",
    },
    globalObject: "typeof self !== 'undefined' ? self : this",
  },
  externals: {
    "node-forge": "commonjs node-forge", // Exclure node-forge du build
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: false,
              esModule: false,
              //   sources: false, // Désactive l'analyse des sources externes
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: {
          loader: "css-loader",
          options: {
            esModule: false, // Permet d'importer les CSS sous forme de chaînes brutes.
          },
        },
      },
    ],
  },
};
