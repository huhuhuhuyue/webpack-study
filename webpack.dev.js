const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin") // 每次打包前自动删除上一次打包出来的文件
const {merge} = require("webpack-merge")
const baseConfig = require("./webpack.base.js")
const webpack = require("webpack")
const devConfig = {
    devtool: "inline-source-map", // 将错误信息定位到源码，参考：https://www.webpackjs.com/configuration/devtool/
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'] 
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
            }
        ]
    },
    mode: "development",
    devServer: {
      contentBase: './dist', // 把哪个目录指定为静态目录，默认为dist/index.html，如果打包出去的html文件不叫index，则不能默认指向xxx.html
      port: 8081, // 端口
      open: true, // 自动打开浏览器的窗口
      hot: true, // 开启hmr（HotModuleReplacementPlugin）的开关
      proxy: {
        "/api": {
          target: "http://localhost:9092"
        }
      },
      hotOnly: true // 不自动刷新浏览器
    },
    plugins: [
        new HtmlWebpackPlugin({ // new HtmlWebpackPlugin可以有多个
            title: 'hello',
            template: "./src/app.html", // 以哪个html为模板
            filename: "index.html", // 生成的html的文件名
            inject: 'body'
        }),
        new CleanWebpackPlugin(), // 打包时删除上次打包的文件
        new webpack.HotModuleReplacementPlugin() // 热更新
    ]
}
module.exports = merge(devConfig, baseConfig)