//  逐步实现一个JS 模版引擎

var name = 'frankie'
var tpl = '<% name %>, 你来试试嘛，小兄弟'
var html = tpl.replace(/<%\s*(\w*?)\s %>/,function(match, variable){
  if(variable === 'name') {
    return name
  }
})

/**
 * 为了考虑到变量个数不固定，并且可以复用的角度
 * 把转换的过程封装成一个render函数
 */
var tpl = '<% name %>, 你来试试嘛，小兄弟,<% age %>'
let data = {
  name: 'frankie',
  age:  23
}
function render(tpl, data) {
  return tpl.replace(/<%\s*(\w*?)\s*%>/g, function (match, variable) {
      if (data.hasOwnProperty(variable)) {
          return data[variable];
      }
  });
}
var a = render(tpl,data)
console.log(a)

/**
 * 考虑到期待匹配传入的字符串内带有逻辑判断
 * 考虑点：if, switch, 三元符号等,
 * 参考到angular 或者 react当中，都会把语法语句放置入{ }当中进行，所以也是一个考量的点
 */

