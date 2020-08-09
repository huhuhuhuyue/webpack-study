import {a} from "./a.js"
import {b} from "./b.js"
console.log(a, b)
// 运行npx webpack时，打包生成bundle文件
// bundle文件是一个自执行函数

// 接收配置，获取打包的入口和出口
//   处理依赖：拿到依赖的路径
//   处理内容：生成chunk代码片段（使用eval()执行）
// (function () {

// })({
//     // ./src/index.js
//     "./src/index.js": {

//     }
// })