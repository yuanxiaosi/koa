const webpack = require('webpack');
const path = require('path');
const APP_PATH = path.resolve(__dirname, '../src/root/static/js');
const readline = require('readline');

module.exports = {
  context: APP_PATH,
  entry: {
    login: './webpack/login/main.jsx',
    index: './webpack/index/main.jsx'
  },
  output: {
    filename: 'entry/[name].js',
    chunkFilename: 'chunk/[name]-[chunkhash].js',
    publicPath: '/'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel', // 'babel-loader' is also a legal name to reference
      query: {
        presets: ['es2015', 'react', 'stage-0'],
      }
    }, {
      test: /\.css$/,
      loader: "style!css"
    }, {
      test: /\.less$/,
      loader: "style!css!less?relativeUrls"
    }, {
      test: /\.(png|jpg|jpeg|gif|woff)$/,
      loader: "file?name=asset/[hash].[ext]"
    }]
  },
  plugins: [
    new webpack.ProgressPlugin(function (percentage, message) {
      const percent = Math.round(percentage * 100);
      readline.clearLine(process.stderr);
      readline.cursorTo(process.stderr, 0);
      process.stderr.write(percent + '% ' + message);
    })/*,
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })*/
  ]
};
