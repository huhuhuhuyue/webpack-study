module.exports = {
    plugins: [
        require("autoprefixer")({
            // 告诉浏览器要兼容到哪些浏览器
            // last 2 versions指的兼容到所有浏览器的最近两个版本
            // >1%指的是只要浏览器的市场份额在全球大于百分之一就兼容
            overrideBrowserslist: ["last 2 versions", ">1%"]
        })
    ]
};