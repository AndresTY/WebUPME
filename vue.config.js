const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://192.168.1.59:8000', 
        changeOrigin: true, 
        pathRewrite: { '^/api': '' },
        secure: false,
      },
    },
  },
});
