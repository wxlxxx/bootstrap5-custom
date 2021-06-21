const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ip = require('ip')
const merge = require('webpack-merge')
const portFinderSync = require('portfinder-sync')
const StyleLintPlugin = require('stylelint-webpack-plugin')

const version = '0.0.1'

const baseConfig = {
  entry: {
    'brand1': './src/entry_brand1.js',
    'brand2': './src/entry_brand2.js',
    'brand3': './src/entry_brand3.js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules\/(?!(bootstrap)\/).*/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  useBuiltIns: 'usage',
                  corejs: 3,
                  targets: {
                    browsers: '> 0.25%, IE 11, not dead'
                  }
                }]
              ],
              plugins: [
              ]
            }
          },
          {
            loader: 'eslint-loader'
          }
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it uses publicPath in webpackOptions.output
              publicPath: '/'
            },
          },
          // Translates CSS into CommonJS
          'css-loader',
          // postcss
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')({
                  'overrideBrowserslist': ['> 1%', 'last 2 versions']
              })]
            }
          },
          // Compiles Sass to CSS
          'sass-loader',
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        exclude: /(images|image|img)/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name:'rn-ui/fonts/[name].[ext]',
              limit:20000
            }
          }
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      automaticNameDelimiter: '-'
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'rn-ui/css/rn-ui-[name]-' + version + '.min.css',
      chunkFilename: 'rn-ui/css/async/rn-ui-[name].min.css'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'docs/index.html'),
      minify: false,
      chunks: ['brand1'],
      templateParameters: {
        'brand': 'brand1',
        'version': version
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'index-brand1.html',
      template: path.resolve(__dirname, 'docs/index.html'),
      minify: false,
      chunks: ['brand1'],
      templateParameters: {
        'brand': 'brand1',
        'version': version
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'index-brand2.html',
      template: path.resolve(__dirname, 'docs/index.html'),
      minify: false,
      chunks: ['brand2'],
      templateParameters: {
        'brand': 'brand2',
        'version': version
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'index-brand3.html',
      template: path.resolve(__dirname, 'docs/index.html'),
      minify: false,
      chunks: ['brand3'],
      templateParameters: {
        'brand': 'brand3',
        'version': version
      }
    }),
    new StyleLintPlugin({
      configFile: '.stylelintrc.json',
      context: 'src',
      files: '**/*.scss'
    })
  ]
}
const devConfig = {
  devtool: 'inline-source-map',
  devServer: {
    host: ip.address(),
    port: portFinderSync.getPort(8080)
  },
  output: {
    filename: 'rn-ui/js/rn-ui-[name]-' + version + '.min.js',
    chunkFilename: 'rn-ui/js/async/rn-ui-[name].min.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
  }
}

const prodConfig = {
  output: {
    filename: 'rn-ui/js/rn-ui-[name]-' + version + '.min.js',
    chunkFilename: 'rn-ui/js/async/rn-ui-[name].min.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: 'https://www.xxx.com/',
  },
  plugins: [
    // new CleanWebpackPlugin()
  ]
}

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    return merge(baseConfig, devConfig)
  }
  if (argv.mode === 'production') {
    return merge(prodConfig, baseConfig)
  }
}
