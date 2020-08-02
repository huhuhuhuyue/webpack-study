// Loader就是⼀个函数，声明式函数，不能⽤箭头函数，因为loader函数中要用到this关键字
// 拿到源代码，作进⼀步的修饰处理，再返回处理后的源码就可以了
// 官⽅⽂档：https://webpack.js.org/contribute/writing-a-loader/
// 接⼝⽂档：https://webpack.js.org/api/loaders/

module.exports = function (source) {
    // console.log(source) // 打印出来的是源代码
    // console.log(this.query) // { text: '你好' }
    const res = source.replace('hello', this.query.text)
    // ———— 返回一个值 ————
    return res

    // ———— 如果要返回多个值 ————
    // this.callback(null, res)
    /** this.callback接收的参数：
        this.callback(
            err: Error | null,  // 第一个参数必须是 Error 或者 null
            content: string | Buffer, // 第二个参数是一个 string 或者 Buffer。
            sourceMap?: SourceMap,    // 可选的：第三个参数必须是一个可以被这个模块解析的 source map。
            meta?: any  // 可选的：第四个选项，会被 webpack 忽略，可以是任何东西（例如一些元数据）。
        );
    */

    // ———— 处理异步的情况（默认只支持同步） ————
    // const callback = this.async() // this.async()返回的其实是this.callback
    // setTimeout(() => {
    //     callback(null, res)
    // }, 3000);
}