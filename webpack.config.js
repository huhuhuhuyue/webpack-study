const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin") // 把css打包成一个单独的css文件，而不是以style标签的形式插入到head
module.exports = {
    entry: {
        main: './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name]-[hash:6].js' // 给打包后的文件名加上6位数的hash："[name]-[hash:6].js"或者"[name].js?[hash:6]"
    },
    mode: "development",
    resolveLoader: {
        modules: ["./node_modules", "./myLoader"] // 告诉webpack去哪找loader，默认是"node_modules"，再加一个"myLoader"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
                // css-loader把css放到chunks中
                // style-loader动态生成style标签，并插入到html的header中
            },
            {
                test: /\.less$/,
                use: [{
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    publicPath: "../" // 如果不配置publicPath，less文件引入的css默认指向css/image下
                  }
                }, 'css-loader', 'postcss-loader', 'less-loader']
                // use: ['kstyle-loader', 'kcss-loader', 'postcss-loader', 'kless-loader']
                // 使用postcss需要在根目录下额外配置postcss.config.js
                // 使用less需按照less-loader、less两个依赖。less负责把less语法转为css；less-loader负责less和webpack之间的通讯
                // css-loader把css放到chunks中
                // style-loader动态生成style标签，并插入到html的header中
                // MiniCssExtractPlugin.loader把css打包为单独的文件，并以link标签的形式插入到html
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
            },
            {
                test: /\.js/,
                // 使用自己写的loader
                // 无需传参
                // use: path.resolve(__dirname, './myLoader/replaceLoader.js')
                // 需要给loader传入参数，并且只配置一个loader
                // use: {
                //     loader: path.resolve(__dirname, './myLoader/replaceLoader.js'),
                //     options: {
                //         name: 'kkb'
                //     }
                // }
                // 需要给loader传入参数，并且需要配置多个loader，由于loader有执行顺序，所有同步loder放在异步loader前面
                use: [
                    {
                        // loader: path.resolve(__dirname, './myLoader/replaceLoader.js'), // 如果想像别的loader一样写loader名称，需要使用resolveLoader
                        loader: "replaceLoader",
                        options: {
                            text: '你好'
                        }
                    },
                    {
                        loader: path.resolve(__dirname, './myLoader/replaceLoaderAsync.js'),
                        options: {
                            name: 'kkb'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ // new HtmlWebpackPlugin可以有多个
            title: 'hello',
            template: "./src/app.html", // 以哪个html为模板
            filename: "app.html", // 生成的html的文件名
            inject: 'body'
        }),
        new MiniCssExtractPlugin({
          filename: "css/[name].css" // 打包出来的文件在css目录下，名字还叫原来的名字
        }) // 要把style-loader换成MiniCssExtractPlugin.loader
    ]
}



/**———— 面试题：hash、chunkhash、contenthash的区别 ————
 * hash：打包成功后会生成一个hash，每次打包时有任意文件修改，打包后的hash就会发生变化，包括打包后的所有文件的名称
 *       如：[name]_[hash].[ext]
 * chunkhash：某个文件发生变化后打包之后的chunkhash改变，其余没变化的文件chunkhash不变
 *       如：index.js中import了index.less，不管是js的内容改变了还是less的内容改变了，chunkhash都会变化
 * contenthash：只有自身内容改变，打包后的contenthash才会改变
 *       如：index.js中import了index.less，如果js的内容改变了，less的内容不变，less文件的contenthash不变

 * js文件推荐使用chunkhash
 * css文件推荐使用contenthash
*/