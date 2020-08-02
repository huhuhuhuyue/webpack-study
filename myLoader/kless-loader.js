const less = require('less')
module.exports = function (source) {
    // 使用less包，将less语法转为css语法
    less.render(source, (err, output) => {
        this.callback(err, output.css)
    })
}