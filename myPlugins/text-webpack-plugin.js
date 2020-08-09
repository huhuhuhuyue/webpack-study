// 注册事件，webpack在编译时会经历很多生命周期、hook

// ———— 查看compiler的生命周期 ————
// const webpack = require("webpack")
// const config = require("../webpack.config.js")
// const webpackConfig = require("../webpack.config.js")
// const compiler = webpack(webpackConfig) // webpack在编译时会生成一个编译器对象
// // compiler官方文档：https://www.webpackjs.com/api/compiler-hooks/
// // compiler的生命周期都挂在了compiler.hooks上面，运行node .\myPlugins\text-webpack-plugin.js查看hookName
// Object.keys(compiler.hooks).forEach((hookName) => {
//     compiler.hooks[hookName].tap("zz", () => {
//         console.log(`run -> ${hookName}`)
//     })
// })
// compiler.run() // 启动

// ———— 实现plugin ————
class textWebpackPlugin {
    // constructor (options) {
    //     console.log(options) // { name: '自定义plugin' }
    // }
    // 自定义插件如何拿到webpack的compiler.hooks？
    // 使用apply函数，每个plugin都要有apply函数
    apply (compiler) {
        // ----异步钩子----
        compiler.hooks.emit.tapAsync('textWebpackPlugin', (compilation, cb) => {
            // console.log(compilation.assets)
            compilation.assets["kkb.txt"] = {
                source: function() { 
                    return "hello kkb";
                },
                size: function() {
                    return 20;
                }
            }
            cb()
        })
        // ----同步钩子----
        // compiler.hooks.compile.tap('textWebpackPlugin', (compilation) => {
        //     console.log('hello compile')
        // })
    }
}
module.exports = textWebpackPlugin
