const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin") // 把css打包成一个单独的css文件，而不是以style标签的形式插入到head
const {CleanWebpackPlugin} = require("clean-webpack-plugin") // 每次打包前自动删除上一次打包出来的文件
const PurifyCSS = require('purifycss-webpack')
const {merge} = require("webpack-merge")
const baseConfig = require("./webpack.base.js")
const glob = require('glob-all')
const prodConfig = {
    mode: "production",
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'] 
            },
            {
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader']
            }
        ]
    },
    optimization: {
        usedExports: true // js摇树
    },
    plugins: [
        new HtmlWebpackPlugin({ // new HtmlWebpackPlugin可以有多个
            title: 'hello',
            template: "./src/app.html", // 以哪个html为模板
            filename: "index.html", // 生成的html的文件名
            inject: 'body'
        }),
        new MiniCssExtractPlugin({
          filename: "css/[name].css" // 打包出来的文件在css目录下，名字还叫原来的名字
        }), // 要把style-loader换成MiniCssExtractPlugin.loader
        new CleanWebpackPlugin(), // 打包时删除上次打包的文件
        new PurifyCSS({ // 清除⽆⽤ css
            paths: glob.sync( // 摇树范围：引入css的js和html
                [
                    path.resolve(__dirname, './src/*.html'), // src下的所有html
                    path.resolve(__dirname, './src/*.js')
                ]
            )
        })
    ]
}

module.exports = merge(prodConfig, baseConfig)