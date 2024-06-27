const { resolve } = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = () => {
  return {
    mode: 'production',
    entry: "./src/index.tsx",
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    devServer: {
      port: 9001
    },
    context: resolve(__dirname, './'),
    module: {
      rules: [
        {
            test: /\.(ts|tsx)$/,
            loader: "ts-loader",
            options: {
              allowTsInNodeModules: true
            }
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i, 
          loader: 'file-loader',
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        }
      ]
  },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        }),
    ]
  }
};