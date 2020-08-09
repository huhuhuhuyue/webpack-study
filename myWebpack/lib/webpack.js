const fs = require("fs")
const path = require("path")
const parser = require("@babel/parser")
const traverse = require("@babel/traverse").default
const { transformFromAst } = require("@babel/core")
module.exports = class webpack {
    constructor (options) {
        // console.log(options)
        this.entry = options.entry
        this.output = options.output
        this.modules = []
    }
    run () {
        const info = this.parse(this.entry) // 处理入口
        this.modules.push(info)
        for (let i = 0; i < this.modules.length; i++) {
            const item = this.modules[i];
            const {yilai} = item;
            if (yilai) {
                for (let key in yilai) {
                    this.modules.push(this.parse(yilai[key])) // 拿到依赖的依赖和源码
                }
            }
            
        }
        // console.log(this.modules)
        // 将modules数组转为对象
        const obj = {}
        this.modules.forEach((item) => {
            obj[item.entryFile] = {
                yilai: item.yilai,
                code: item.code
            }
        })
        this.file(obj)
    }
    parse (entryFile) {
        // console.log(entryFile) // ./src/index.js
        const content = fs.readFileSync(entryFile, "utf-8")
        const ast = parser.parse(content, { // 把读取到的入口文件的内容转为ast语法书
            sourceType: "module"
        })
        // console.log(ast.program.body) // 包括两个ImportDeclaration节点和一个ExpressionStatement节点
        const yilai = {}
        traverse(ast, { // 使用traverse从ast中提取出来ImportDeclaration
            ImportDeclaration ({node}) {
                // console.log(node.source.value) // ./a.js  ./b.js
                const newPathName = "./" + path.join(
                    path.dirname(entryFile), // ./src
                    node.source.value
                )
                // console.log(newPathName) // ./src\a.js    ./src\b.js
                yilai[node.source.value] = newPathName // key是相对于入口模块的路径，值是相对于项目的路径
            }
        })
        // console.log(yilai) // { './a.js': './src\\a.js', './b.js': './src\\b.js' }
        const {code} = transformFromAst(ast, null, {
            presets: ["@babel/preset-env"]
        })
        // console.log(code) // 入口模块的依赖和源码
        return {
            entryFile,
            yilai,
            code
        }
    }
    file (code) {
        const filePath = path.join(this.output.path, this.output.filename)
        const newCode = JSON.stringify(code) // 不使用JSON方法转的话会被自动转为[object Object]
        const bundle = `(function (graph) {
            function require (module) {
                function pathRequire (realtivePath) {
                    return require(graph[module].yilai[realtivePath])
                }
                var exports = {};
                (function (require, exports, code) {
                    eval(code)
                })(pathRequire, exports, graph[module].code)
                return exports;
            }
            require('${this.entry}')
        })(${newCode})`
        fs.writeFileSync(filePath, bundle, "utf-8")
    }
}