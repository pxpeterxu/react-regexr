'use strict';

var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    'web.js': __dirname + '/dev/Init.js',
    'styles.css': __dirname + '/assets/main.scss'
  },
  output: {
    filename: '[name]',
    path: __dirname + '/build'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel-loader'
    }, {
      test: /\.(scss|sass|css)$/,
      loader: ExtractTextPlugin.extract([{
        loader: 'css-loader'
      }, {
        loader: 'sass-loader',
        options: {
          includePaths: [__dirname + '/node_modules/regexr/scss/third-party/compass-mixins']
        }
      }])
    }, {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      loader: 'file-loader?name=fonts/[name].[ext]'
    }]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'styles.css',
      allChunks: true
    })
  ]
};
