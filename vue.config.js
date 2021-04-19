module.exports = {
  assetsDir: 'static',
  parallel: false,
  publicPath: './',
  transpileDependencies: [
    'vuetify'
  ],
  //虚拟代理，处理跨域
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000/',
        // 允许跨域
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    
  }

}
