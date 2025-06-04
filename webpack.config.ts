import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import HtmlWebpackPlugin from 'html-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type Env = Record<string, unknown>;
type Options = { mode: 'development' | 'production' };

const webpackConfig = (_env: Env, options: Options) => {
  const baseConfig: Record<string, unknown> = {
    entry: './src/index.ts',
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
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      port: 8000,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.wasm', '.mjs', '.cjs', '.json'],
    },
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Trying',
      }),
    ],
  };

  if (options.mode === 'development') {
    baseConfig.devServer = {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      port: 9000,
    };
  }

  return baseConfig;
};

export default webpackConfig;
