/**
 * 防抖 & 节流
 * 防抖：触发高频事件后n秒内函数只会执行一次，如果n秒内高频事件再次被触发，则重新计算时间
 */
function debounce(fn) {
    let timeout = null;     
    return function() {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            fn.apply(this, arguments)
        }, 500)
    }
}
function sayHi() {
    console.log('防抖成功')
}
var inp = document.getElementById('inp')
inp.addEventListener('input', debounce(sayHi))      // 防抖

/**
 * 节流
 * 高频事件触发，但在n秒内只会执行一次，所以节流会稀释函数的执行频率
 */
function throttle(fn) {
    let canRun = true;      // 通过闭包保存一个标记
    return function() {
        if(!canRun) return;     // canRun为true才能继续往下走
        canRun = false
        setTimeout(() => {
            fn.apply(this, arguments)
            canRun = true
        }, 500)
    }
}
function sayHi2(e) {
    console.log(e.target.innerWidth, e.target.innerHeight)
}
window.addEventListener('resize', throttle(sayHi2))


/**
 * 模块化
 * commonJs  NodeJs忠实践行者 
 *      用同步的方式加载模块，在服务端，模块文件都存在本地磁盘，读取非常快；在浏览器端，限于网络原因，更合理的方案是使用异步加载
 *      运行时加载 模块就是对象
 *      输出的是值拷贝，模块内部的变化就影响不到这个值
 *      module.exports定义当前模块的输出接口，用require加载模块
 * ES6 Module模块化
 *      export规定模块的对外接口 import导入规定模块
 *      编译时加载 模块不是对象，而是通过export命令显式指定输出的代码
 *      运行机制与CommonJS不一样,遇到模块加载命令import，就会生成一个只读引用，等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。
 *      使用import命令的时候，需要知道加载的变量名或函数名；
 *      export default命令，为模块指定默认输出，对应的import语句不需要使用大括号
 * require.js AMD模式
 *      用异步方式加载模块
 *      推崇依赖前置、提前执行
 *      用require.config()指定引用路径，用define()定义模块，用require()加载模块
 * sea.js CMD模式
 *      另一种与AMD类似的模块化方案
 *      推崇依赖就近、延迟执行
 */
