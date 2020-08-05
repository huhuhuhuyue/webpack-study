// import css from './css/index.css'
// import css2 from './css/style.less'

// ———— 跨域问题演示 ————
// import axios from 'axios'
// axios.get('/api/info').then(res=>{
//   console.log(res)
// })

// ———— css热更新演示 ————
// var btn = document.createElement("button");
// btn.innerHTML = "新增";
// document.body.appendChild(btn);
// btn.onclick = function() {
//   var div = document.createElement("div");
//   div.innerHTML = "item";
//   document.body.appendChild(div);
// };

// ———— js热更新演示 ————
import counter from "./js/counter";
import number from "./js/number";
counter();
number();
// 当webpack.config.js中devServer配置了hot: true时，module.hot为true
if (module.hot) {
  // accept接收两个参数，第一个为要监听的模块，第二个参数是当监听到模块发生变化后的回调函数
  module.hot.accept("./js/number.js", function() {
    // 移除id为number的dom节点，再重新执行一次number()
    document.body.removeChild(document.getElementById("number"));
    number();
  });
}
console.log('hello webpack!')