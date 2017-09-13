/**
 * Promise标准
 * 1:只有一个then方法，没有catch, race, all 方法，甚至没有构造函数
 * 2:then方法返回一个新的promise
 */

 // promise2 = promise1.then(alert)
 // promise2 != promise1 // true

 // Promise函数接受一个executor函数，executor(执行者函数)执行完同步或者异步操作之后，调用resolve和reject



 // 构造函数框架如下
function MyPromise(executor) {

  var self = this
  self.status = 'pending' // promise的状态
  self.data = undefined  //  promise的值
  self.onResolvedCallBack = [] //  promise 执行resolve时候的回调函数集合，因为Promise结束之前有多个回调添加到数组当中
  self.onRejectedCallBack = [] // 概念同上

  executor(resolve, reject)

  //  定义resolve 和 reject函数
  function resolve(value) {
    if(self.status == 'pending'){
      self.status = 'resolved'
      self.data = value
      for(var i = 0; i < self.onRejectedCallBack.length; i++) {
        //  执行每个回调，并且把value当成参数传递进去
        self.onRejectedCallBack[i](value)
      }
    }
  }
  function reject(error) {
    if(self.status == 'pending'){
      self.status = 'rejected'
      self.data = error
      for(var i = 0; i < self.onRejectedCallBack.length; i++){
        self.onRejectedCallBack[i](error)
      }
    }
  }
  //  如果executor出错，则promise应该被其throw出reject值
  try {
    executor(resolve, reject)
  } catch (error) {
    reject(error)
  }
  /**
   * promise有一个then方法，then方法是通过点出来所以理应写在promise对象的原型链上.
   * 并且then方法会返回一个新的promise对象，
   */
};

// then方法接受两个参数，onResolved和onReject，分别是promise成功或者失败之后的回调
MyPromise.prototype.then = function(onResolved, onRejected) {
  var self = this
  var promise2

  //  promise/A+标准当中，如果then的参数不是function，那么就要忽略它，并且以下面的方式处理
  onResolved = typeof onResolved === 'function' ? onResolved : function(v) {}
  onRejected = typeof onRejected === 'function' ? onRejected : function(e) {}

  if (self.status === 'resolve'){
    // 如果promise 1 的状态已经确定称为resolved onResolved
    return promise2 = new MyPromise(function(resolve, reject) {
      try {
        var x = onResolved(self.data)
        //  如果onReslove的返回值是一个promise对象，直接就取它的结果做promise2 的结果
        if(x instanceof MyPromise){
          x.then(resolve, reject)
        }
        resolve(x)
      } catch (error) {
        reject(error)
      }
    })
  }

  if (self.status === 'reject') {
    return promise2 = new MyPromise(function(resolve, reject) {
      try {
        var x = onRejected(self.data)
        if(x instanceof MyPromise){
          x.then(resolve, reject)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  if(self.status === 'pending'){
    // 如果promise状态是pending的时候，不能确定到底执行的是onReject还是onResolve,所以需要等待status的状态变更
    return promise2 = new MyPromise(function(resolve, reject) {
      self.onResolvedCallBack.push(function(value){
        try {
          var x = onResolved(self.data)
          
          if(x instanceof MyPromise) {
            x.then(resolve, reject)
          }
          resolve(x)
        } catch (error) {
          reject(error)
        }
      })

      self.onRejectedCallBack.push(function(error){
        try {
          var x = onRejected(self.data)

          if(x instanceof MyPromise){
            x.then(resolve, reject)
          }

        } catch (error) {
          reject(error)
        }
      })
    })
  }
}

 
// var promise = new MyPromise(function(resolve, reject){
//   /**
//    * 如果操作成功，则调用resolve并且传入value
//    * 如果操作失败，则调用reject并传入error
//    */
  
//  })
// console.log('111')

new MyPromise((resolve,reject)=>{
  resolve('1')
}).then((data)=>{console.log(data)})


