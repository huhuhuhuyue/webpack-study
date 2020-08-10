const path = require('path')
const baseConfig = {
    entry: {
        main: './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name]-[hash:6].js' // 给打包后的文件名加上6位数的hash："[name]-[hash:6].js"或者"[name].js?[hash:6]"
    },
    devtool: "inline-source-map", // 将错误信息定位到源码，参考：https://www.webpackjs.com/configuration/devtool/
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif)$/,   // 匹配多种类型的文件
                use: {
                    loader: "file-loader",
                    options: {  // options额外的配置，⽐如资源名称，不配置name打包后文件名是一串hash
                        name: "[name]_[hash].[ext]",  // [name]资源原来的名称、[ext]资源原来的后缀
                        outputPath: "images/"  //打包后的存放位置
                    }
                }
            },
            {
                test: /\.js/,
                use: {
                    loader: 'babel-loader', // 负责babael/core和webpack的沟通
                }
            }
        ]
    }
}
module.exports = baseConfig