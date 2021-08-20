const path = require('path')
module.exports = {
  entry: './examples/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
  module: {
    rules: [
      { test: /(\.jsx|jx)$/, use: 'babel-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      // { test: /\.(png|jpg|gif)$/, use: ['file-loader'] }
      { test: /\.(png|jpg|gif)$/, use: [{ loader: 'file-loader', options: {}}] }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    hot: true,
    inline: true,
    compress: true,
    progress: true,
    port: 8100
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname)
    }
  }
}
