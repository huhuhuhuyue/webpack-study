// 把打包出去的js中的css拿出来放到动态生成的style标签里，并放到head中
module.exports = function (source) {
    return `const tag = document.createElement('style');
    tag.innerHTML = ${JSON.stringify(source)};
    document.head.appendChild(tag);`
}