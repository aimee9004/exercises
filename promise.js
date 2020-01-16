/**
 * 八段代码彻底掌握 Promise
 * @艾特老干部
 */
// 1. Promise的立即执行性
var p = new Promise((resolve, reject) => {
    console.log('create a promise')
    resolve('success')
})
console.log('after new promise')
p.then(value => {
    console.log(value)
})
/**
 * 控制台输出：
 * create a promise    
 * after new promise    
 * success
 * 
 * Promise对象表示未来某个将要发生的事件，但在创建（new）Promise时，作为Promise参数传入的函数是会被立即执行的，只是其中执行的代码可以是异步代码。有些同学会认为，当Promise对象调用then方法时，Promise接收的函数才会执行，这是错误的。因此，代码中"create a promise"先于"after new Promise"输出。
 */

//  2. Promise三种状态
var p1 = new Promise((resolve, reject) => {
    resolve(1)
})
var p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(2)
    }, 500)
})
var p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject(3)
    }, 500)
})
console.log(p1)
console.log(p2)
console.log(p3)
setTimeout(() => {
    console.log(p2)
}, 1000)
setTimeout(() => {
    console.log(p3)
}, 1000)

p1.then(value => {
    console.log(value)
})
p2.then(value => {
    console.log(value)
})
p3.catch(err => {
    console.log(err)
})
/**
 * 控制台输出：
 * Promise{ [[PromiseState]]: "resolved", [[PromiseValue]]: 1 }
 * Promise{ [[PromiseState]]: "pending", [[PromiseValue]]: undefined }
 * Promise{ [[PromiseState]]: "pending", [[PromiseValue]]: undefined }
 * 1
 * Promise{ [[PromiseState]]: "pending", [[PromiseValue]]: undefined }
 * 2
 * 3
 * Promise{ [[PromiseState]]: "resolved", [[PromiseValue]]: 2 }
 * Promise { [[PromiseState]]: "rejected", [[PromiseValue]]: 3 }
 * 
 * Promise的内部实现是一个状态机。Promise有三种状态：pending，resolved，rejected。当Promise刚创建完成时，处于pending状态；当Promise中的函数参数执行了resolve后，Promise由pending状态变成resolved状态；如果在Promise的函数参数中执行的不是resolve方法，而是reject方法，那么Promise会由pending状态变成rejected状态。
 * p2、p3刚创建完成时，控制台输出的这两台Promise都处于pending状态，但为什么p1是resolved状态呢？ 这是因为p1 的函数参数中执行的是一段同步代码，Promise刚创建完成，resolve方法就已经被调用了，因而紧跟着的输出显示p1是resolved状态。我们通过两个setTimeout函数，延迟1s后再次输出p2、p3的状态，此时p2、p3已经执行完成，状态分别变成resolved和rejected。
 */

//  3. Promise状态的不可逆性
var p1 = new Promise((resolve, reject) => {
    resolve('success1')
    resolve('success2')
})
var p2 = new Promise((resolve, reject) => {
    resolve('success')
    reject('reject')
})
p1.then(value => {
    console.log(value)
})
p2.then(value => {
    console.log(value)
})
/**
 * 控制台输出：
 * success1
 * success
 * 
 * Promise状态的一旦变成resolved或rejected时，Promise的状态和值就固定下来了，不论你后续再怎么调用resolve或reject方法，都不能改变它的状态和值。因此，p1中resolve("success2")并不能将p1的值更改为success2，p2中reject("reject")也不能将p2的状态由resolved改变为rejected.
 */

//  4. 链式调用
var p = new Promise(function(resolve, reject){
    resolve(1);
});
p.then(function(value){               //第一个then
    console.log(value);
    return value*2;
}).then(function(value){              //第二个then
    console.log(value);
}).then(function(value){              //第三个then
    console.log(value);
    return Promise.resolve('resolve'); 
}).then(function(value){              //第四个then
    console.log(value);
    return Promise.reject('reject');
}).then(function(value){              //第五个then
    console.log('resolve: '+ value);
}, function(err){
    console.log('reject: ' + err);
})
/**
 * 控制台输出：
 * 1
 * 2
 * undefined
 * "resolve"
 * "reject: reject"
 * 
 * Promise对象的then方法返回一个新的Promise对象，因此可以通过链式调用then方法。then方法接收两个函数作为参数，第一个参数是Promise执行成功时的回调，第二个参数是Promise执行失败时的回调。两个函数只会有一个被调用，函数的返回值将被用作创建then返回的Promise对象。这两个参数的返回值可以是以下三种情况中的一种：
 * return 一个同步的值 ，或者 undefined（当没有返回一个有效值时，默认返回undefined），then方法将返回一个resolved状态的Promise对象，Promise对象的值就是这个返回值。
 * return 另一个 Promise，then方法将根据这个Promise的状态和值创建一个新的Promise对象返回。
 * throw 一个同步异常，then方法将返回一个rejected状态的Promise,  值是该异常。
 * 
 * 代码中第一个then会返回一个值为2（1*2），状态为resolved的Promise对象，于是第二个then输出的值是2。第二个then中没有返回值，因此将返回默认的undefined，于是在第三个then中输出undefined。第三个then和第四个then中分别返回一个状态是resolved的Promise和一个状态是rejected的Promise，依次由第四个then中成功的回调函数和第五个then中失败的回调函数处理。
 */

//  5. Promise then()回调异步性
var p = new Promise((resolve, reject) => {
    resolve('success')
})
p.then(value => {
    console.log(value)
})
console.log('which one is called first ?')
/**
 * 控制台输出：
 * which one is called first ?
 * success
 * 
 * Promise接收的函数参数是同步执行的，但then方法中的回调函数执行则是异步的，因此，"success"会在后面输出。
 */

//  6. Promise中的异常
var p1 = new Promise((resolve, reject) => {
    foo.bar()
    resolve(1)
})
p1.then(value => {
    console.log('p1 then value: ' + value)
}, err => {
    console.log('p1 then err: ' + err)
}).then(value => {
    console.log('p1 then then value: ' + value)
}, err => {
    console.log('p1 then then err: ' + err)
})

var p2 = new Promise((resolve, reject) => {
    resolve(2)
})
p2.then(value => {
    console.log('p2 then value: ' + value)
    foo.bar()
}, err => {
    console.log('p2 then err: ' + err)
}).then(value => {
    console.log('p2 then then value: ' + value)
}, err =>{
    console.log('p2 then then err: ' + err)
    return 1
}).then(value => {
    console.log('p2 then then then value: ' + value)
}, err => {
    console.log('p2 then then then err: ' + err)
})
/**
 * 控制台输出：
 * p1 then err: ReferenceError: foo is not defined
 * p2 then value: 2
 * p1 then then value: undefined
 * p2 then then err: ReferenceError: foo is not defined
 * p2 then then then value: 1
 * 
 * Promise中的异常由then参数中第二个回调函数（Promise执行失败的回调）处理，异常信息将作为Promise的值。异常一旦得到处理，then返回的后续Promise对象将恢复正常，并会被Promise执行成功的回调函数处理。另外，需要注意p1、p2 多级then的回调函数是交替执行的 ，这正是由Promise then回调的异步性决定的。
 */

//  7. Promise.resolve()
var p1 = Promise.resolve(1)
var p2 = Promise.resolve(p1)
var p3 = new Promise((resolve, reject) => {
    resolve(1)
})
var p4 = new Promise((resolve, reject) => {
    resolve(p1)
})
console.log(p1 === p2)
console.log(p1 === p3)
console.log(p1 === p4)
console.log(p3 === p4)
p4.then(value => {
    console.log('p4=' + value)
})
p2.then(value => {
    console.log('p2=' + value)
})
p1.then(value => {
    console.log('p1=' + value)
})
/**
 * 控制台输出：
 * true
 * false
 * false
 * false
 * p2=1
 * p1=1
 * p4=1
 * 
 * Promise.resolve(...)可以接收一个值或者是一个Promise对象作为参数。当参数是普通值时，它返回一个resolved状态的Promise对象，对象的值就是这个参数；当参数是一个Promise对象时，它直接返回这个Promise参数。因此，p1 === p2。但通过new的方式创建的Promise对象都是一个新的对象，因此后面的三个比较结果都是false。另外，为什么p4的then最先调用，但在控制台上是最后输出结果的呢？因为p4的resolve中接收的参数是一个Promise对象p1，resolve会对p1”拆箱“，获取p1的状态和值，但这个过程是异步的
 */

//  8. resolve vs reject
var p1 = new Promise((resolve, reject) => {
    resolve(Promise.resolve('resolve'))
})
var p2 = new Promise((resolve, reject) => {
    resolve(Promise.reject('reject'))
})
var p3 = new Promise((resolve, reject) => {
    reject(Promise.resolve('resolve'))
})
p1.then(function fulfilled(value) {
    console.log('fulfilled: ' + value)
}, function rejected(err) {
    console.log('rejected: ' + err)
})
p2.then(function fulfilled(value) {
    console.log('fulfilled: ' + value)
}, function rejected(err) {
    console.log('rejected: ' + err)
})
p3.then(function fulfilled(value) {
    console.log('fulfilled: ' + value)
}, function rejected(err) {
    console.log('rejected: ' + err)
})
/**
 * 控制台输出：
 * p3 rejected: [object Promise]
 * p1 fulfilled: resolve
 * p2 rejected: reject
 * 
 * Promise回调函数中的第一个参数resolve，会对Promise执行"拆箱"动作。即当resolve的参数是一个Promise对象时，resolve会"拆箱"获取这个Promise对象的状态和值，但这个过程是异步的。p1"拆箱"后，获取到Promise对象的状态是resolved，因此fulfilled回调被执行；p2"拆箱"后，获取到Promise对象的状态是rejected，因此rejected回调被执行。但Promise回调函数中的第二个参数reject不具备”拆箱“的能力，reject的参数会直接传递给then方法中的rejected回调。因此，即使p3 reject接收了一个resolved状态的Promise，then方法中被调用的依然是rejected，并且参数就是reject接收到的Promise对象。
 */

  