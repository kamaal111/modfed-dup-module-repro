import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

const { ModuleFederationPlugin } = webpack.container;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type Env = Record<string, unknown>;
type Options = { mode: 'development' | 'production' };

const webpackConfig = (_env: Env, options: Options) => {
  const baseConfig: webpack.Configuration & { devServer?: WebpackDevServerConfiguration } = {
    entry: './src/index',
    devtool: 'inline-source-map',
    mode: options.mode,
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.wasm', '.mjs', '.cjs', '.json'],
    },
    output: {
      publicPath: 'auto',
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'app2',
        filename: 'remoteEntry.js',
        exposes: {
          './App': './src/App',
        },
        shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
    ],
  };

  if (options.mode === 'development') {
    baseConfig.devServer = {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      port: 3002,
    };
  }

  return baseConfig;
};

export default webpackConfig;
