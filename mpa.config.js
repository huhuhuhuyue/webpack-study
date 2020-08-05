const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin") // 每次打包前自动删除上一次打包出来的文件
const glob = require("glob") // npm i glob -D

// 动态生成entry和htmlWebpackPlugins
const setMpa = () => {
    const entry = {}
    const htmlWebpackPlugins = []
    const entryFiles = glob.sync(path.join(__dirname, "./src/*/index.js")) // 找到符合"./src/*/index.js"的文件
    // console.log(entryFiles) // ['xxx/src/detail/index.js', xxx/src/home/index.js', xxx/src/list/index.js']
    entryFiles.map((item, index) => {
        const match = item.match(/src\/(.*)\/index\.js$/)
        const pageName = match && match[1]
        // console.log(pageName, item) // detail  xxx/src/detail/index.js
        entry[pageName] = item

        htmlWebpackPlugins.push(
            new HtmlWebpackPlugin({
                title: pageName,
                template: path.join(__dirname, `src/${pageName}/index.html`),
                filename: `${pageName}.html`,
                chunks: [pageName]
            })
        )
    })

    return {entry, htmlWebpackPlugins}
}
const {entry, htmlWebpackPlugins} = setMpa()

module.exports = {
    entry, // entry: {home: './src/home/index.js', list: './src/list/index.js', detail: './src/detail/index.js'},
    output: {
        path: path.resolve(__dirname, './mpa'),
        filename: '[name]-[chunkhash:6].js' // 给打包后的文件名加上6位数的hash："[name]-[hash:6].js"或者"[name].js?[hash:6]"
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
            },
            {
                test: /\.(png|jpe?g|gif)$/,   // 匹配多种类型的文件
                use: {
                    loader: "file-loader",
                    options: {  // options额外的配置，⽐如资源名称，不配置name打包后文件名是一串hash
                        name: "[name]_[hash].[ext]",  // [name]资源原来的名称、[ext]资源原来的后缀
                        outputPath: "images/"  //打包后的存放位置
                    }
                }
            }
        ]
    },
    plugins: [
        ...htmlWebpackPlugins,
        // new HtmlWebpackPlugin({title: 'detail', template: "./src/detail/index.html", filename: "detail.html", chunks: ["detail"]}),
        new CleanWebpackPlugin() // 打包时删除上次打包的文件
    ]
}