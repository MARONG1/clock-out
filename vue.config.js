module.exports = {
  lintOnSave: false,
  productionSourceMap:false,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4000',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
