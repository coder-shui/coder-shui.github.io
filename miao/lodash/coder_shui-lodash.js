var coder_shui = function () {
  function type(arg) {
    if (arg !== arg) return 'NaN'
    if (typeof (arg) !== 'object') {
      return (typeof (arg))
    } else if (Array.isArray(arg)) {
      return 'array'
    } else if (!arg) {
      return 'null'
    } else {
      return 'object'
    }
  }

  function isEqual(a, b) {
    if (type(a) !== type(b)) {
      return false
    } else if (a !== a && b !== b) {
      return true
    } else if (type(a) === 'object') {
      for (let i in a) {
        if (!b[i] || !isEqual(a[i], b[i])) {
          return false
        }
      }
      for (let j in b) {
        if (!a[j] || !isEqual(a[j], b[j])) {
          return false
        }
      }
      return true
    } else if (type(a) === 'array') {
      if (a.length !== b.length) {
        return false
      } else {
        for (let i = 0; i < a.length; i++) {
          if (!isEqual(a[i], b[i])) {
            return false
          }
        }
      }
      return true
    } else if (type(a) === 'number' || type(a) === 'string' || type(a) === 'boolean' || type(a) === 'undefined') {
      return a === b
    } else {
      return true
    }
  }

  function match(str) {
    return function (obj) {
      let reg = /[a-zA-Z]/
      for (let i = 0; i < str.length; i++) {
        let c = str[i]
        if (reg.test(c)) {
          let j = i + 1
          while (j < str.length && str[j] !== '.' && str[j] !== '[') {
            j++
          }
          let temp = str.slice(i, j)
          obj = obj[temp]
          i = j - 1
        } else if (c == '.') {
          let j = i + 1
          while (j < str.length && str[j] !== '.' && str[j] !== '[') {
            j++
          }
          let temp = str.slice(i + 1, j)
          obj = obj[temp]
          i = j - 1
        } else if (c == '[') {
          let j = i + 1
          while (j < str.length && str[j] !== ']') {
            j++
          }
          let temp = str.slice(i + 1, j)
          obj = obj[temp]
          i = j - 1
        }
      }
      return obj
    }
  }

  function i2(a) { //string 返回  o[a] 
    if (type(a) == 'string') {
      // return function (o) {
      //   return o[a]
      // }
      return match(a)
    } else if (type(a) == 'array') {
      return function (o) {
        if (a[0] in o && o[a[0]] === a[1]) {
          return true
        } else {
          return false
        }
      }
    } else if (type(a) == 'object') {
      return function (o) {
        for (let i in a) {
          if (!(i in o) || o[i] !== a[i]) {
            return false
          }
        }
        return true
      }
    } else {
      return a
    }
  }

  function i(args) { //string 返回 o[args] 
    if (type(args) == 'string') {
      return function (o) {
        return args in o
      }
    } else if (type(args) == 'array') {
      return function (o) {
        return o[args[0]] === args[1]
      }
    } else if (type(args) == 'object') {
      return function (o) {
        for (let k in args) {
          if (!o[k] || o[k] !== args[k]) {
            return false
          }
        }
        return true
      }
    } else if (type(args) == 'function') {
      return args
    }
  }


  function remove(array, fun) { //fun(array[i])为真,删除当前元素,并递归删除所有满足fun(为真的)元素,原地删除
    let flag = 1
    for (let i = 0; i < array.length; i++) {
      if (fun(array[i], i, array)) {
        flag = 0
        for (let j = i; j < array.length; j++) {
          array[j] = array[j + 1]
        }
        array.length = array.length - 1
        break
      }
    }
    if (flag) {
      return array
    } else {
      return remove(array, fun)
    }
  }

  function sli(array, i, j) {
    array.splice(i, j)
    return array
  }


  //辅助函数
  function ary(f, n = f.length) { // f 为目标函数,其 length 属性 表示其形参的数量,
    return function (...args) { //返回目标函数(形参最多为 n)的 版本
      return f(...args.slice(0, n))
    }
  }

  function before(n, f) { //前 n 次 使用 this 指向被创建出来的函数,并且 形参 为每次调用传过来的形参, 大于 n 次则返回第 n 次调用 它时返回的值 
    let c = 0
    let res
    return function (...args) {
      if (c <= n) {
        res = f.call(this, ...args)
        c++
        return res
      } else {
        return res
      }
    }
  }

  function after(n, f) { // 返回一个函数 被调用 n 次以后 才开始调用原函数
    let c = 0
    return function (...args) {
      c++
      if (c > n) {
        return f.call(this, ...args)
      }
    }
  }

  function flip(f) {
    return function (...args) {
      return f(args.reverse())
    }
  }

  function negete(predicate) {
    return function (...args) {
      return !predicate(...args)
    }
  }

  function spread(f, start = 0) {
    return function (...args) {
      return f.apply(this, ...args)
    }
  }

  // function bind(f, thisArg, ...partials) {
  //   return function (...args) {
  //     var copy = partials.slice()
  //     for (var i = 0; i < copy.length; i++) {
  //       if (copy[i] === window) {
  //         copy[i] = args.shift()
  //       }
  //     }
  //     return f.call(thisArg, ...copy, ...args)
  //   }
  // }

  function bind(f, thisArg, ...partials) { // 绑定 函数 f 的 this 为 thisArg, 并提供参数非顺序绑定, 空出来的参数 用 window 代替.
    return function (...args) { //args 表示绑定后 传过来的参数 ,相当于 partials 的 windows 序列
      let c = partials.slice() //纯函数,不改变外部变量
      for (let i = 0; i < c.length; i++) {
        if (c[i] !== window) { //如果 当前形参没有绑定过,即为 window , 就将 调用时传过来的 参数按顺序 赋值 给 window
          c[i] = args.shift()
        }
      }
      return f.call(thisArg, ...c)
    }
  }

  function bindKey(obj, key, partials) {
    return bind(obj[key], obj[key], partials)
  }

  function curry(f, arity = f.length) { // 返回一个函数 f 的柯里化版本, arity 表示 执行函数的 参数的最小数量(默认等于函数的length(形参数量)), 
    return function (...args) { // 如果 接受的参数不够,则继续返回 绑定 接受参数以后的函数的 柯里化版本,否则 就直接运行 函数
      if (args.length < arity) {
        return curry(f.bind(null, ...args), arity - args.length) // arity 随着接受更多的参数 而减少
      } else {
        return f(args)
      }
    }
  }



  // high order function
  // function flatten(ary) {
  //   return [].concat(...ary)
  // }

  // function flatten(ary) {
  //   return [].concat.apply([], ary)
  // }
  // const flatten = [].concat.apply.bind([].concat, [])
  // lodash function
  function chunk(array, size) {
    if (array.length < size) {
      return array
    }
    let temp
    let arr = []
    let i = 0
    while (i < array.length) {
      temp = size
      let t = []
      while (temp) {
        if (array[i]) t.push(array[i])
        i++
        temp--
      }
      arr.push(t)
    }
    return arr
  }

  function compact(array) {
    let res = []
    for (let i = 0; i < array.length; i++) {
      if (array[i]) res.push(array[i])
    }
    return res
  }

  function concat() {
    if (!arguments[0]) return undefined
    let arr = arguments[0]
    for (let i = 1; i < arguments.length; i++) {
      if (Array.isArray(arguments[i])) {
        for (let j = 0; j < arguments[i].length; j++) {
          arr.push(arguments[i][j])
        }
      } else if (arguments[i] !== undefined && arguments[i] !== null && arguments[i] == arguments[i]) arr.push(arguments[i])
    }
    return arr
  }

  function difference(array, ...values) {
    let obj = {}
    let res = []
    for (let i = 0; i < values.length; i++) {
      for (let j = 0; j < values[i].length; j++) {
        obj[values[i][j]] = i
      }
    }
    for (let i = 0; i < array.length; i++) {
      if (obj[array[i]] == undefined) res.push(array[i])
    }
    return res
  }

  function join(array, sep) {
    let str = ''
    sep = "" + sep
    for (let i = 0; i < array.length - 1; i++) {
      str = str + array[i] + sep
    }
    str += array[array.length - 1]
    return str
  }

  function last(array) {
    return array[array.length - 1]
  }

  function lastIndexOf(array, value, fromIndex = array.length - 1) {
    for (let i = fromIndex; i >= 0; i--) {
      if (array[i] === value) return i
    }
    return -1
  }

  function drop(array, n = 1) {
    let res = []
    for (let i = n; i < array.length; i++) {
      res.push(array[i])
    }
    return res
  }

  function dropRight(array, n = 1) {
    let res = []
    for (let i = 0; i < array.length - n; i++) {
      res.push(array[i])
    }
    return res
  }

  function fill(array, value, s = 0, e = array.length) {
    for (let i = s; i < e; i++) {
      if (array.length < s) {
        for (let j = array.length; j <= s; j++) {
          array[j] = j
        }
      }
      array[i] = value
    }
    return array
  }

  function findIndex(array, f, fromIndex = 0) {
    if (typeof (f) == 'function') {
      for (let i = fromIndex; i < array.length; i++) {
        if (f(array[i])) return i
      }
      return -1
    } else if (Array.isArray(f)) {
      for (let i = fromIndex; i < array.length; i++) {
        for (let j in array[i]) {
          if (f[0] == j && f[1] == array[i][j]) return i
        }
      }
      return -1
    } else if (typeof (f) == 'object') {
      for (let i = fromIndex; i < array.length; i++) {
        for (let j in array[i]) {
          if (f[j] && array[i][j] == f[j]) return i
        }
      }
      return -1
    } else if (typeof (f) == 'string') {
      for (let i = fromIndex; i < array.length; i++) {
        for (let j in array[i]) {
          if (array[i][f]) return i
        }
      }
      return -1
    }
  }

  function findLastIndex(array, f, fromIndex = array.length - 1) {
    if (typeof (f) == 'function') {
      for (let i = fromIndex; i >= 0; i--) {
        if (f(array[i])) return i
      }
      return -1
    } else if (Array.isArray(f)) {
      for (let i = fromIndex; i >= 0; i--) {
        for (let j in array[i]) {
          if (f[0] == j && f[1] == array[i][j]) return i
        }
      }
      return -1
    } else if (typeof (f) == 'object') {
      for (let i = fromIndex; i >= 0; i--) {
        for (let j in array[i]) {
          if (f[j] && array[i][j] == f[j]) return i
        }
      }
      return -1
    } else if (typeof (f) == 'string') {
      for (let i = fromIndex; i >= 0; i--) {
        for (let j in array[i]) {
          if (array[i][f]) return i
        }
      }
      return -1
    }
  }

  function flatten(array) {
    let res = []
    // let flag = 0
    for (let i = 0; i < array.length; i++) {
      if (Array.isArray(array[i])) {
        for (let j = 0; j < array[i].length; j++) {
          res[res.length] = array[i][j]
          // flag = 1
        }
      } else res[res.length] = array[i]
    }
    return res
  }

  function flattenDeep(array) {
    let res = []
    if (!Array.isArray(array)) return array
    for (let i = 0; i < array.length; i++) {
      if (Array.isArray(array[i])) {
        coder_shui.concat(res, flattenDeep(array[i]))
      } else {
        res[res.length] = array[i]
      }
    }
    return res
  }

  function flattenDepth(array, depth = 1) {
    let res = array
    while (depth) {
      res = flatten(res)
      depth--
    }
    return res
  }

  function fromPairs(array) {
    let res = {}
    let postfix = '*'
    for (let i = 0; i < array.length; i++) {
      if (res[array[i][0]]) {
        res[array[i][0] + postfix] = array[i][1]
        postfix += '*'
      } else res[array[i][0]] = array[i][1]
    }
    return res
  }

  function head(array) {
    return array[0]
  }

  function indexOf(array, value, fromIndex = 0) {
    let l = fromIndex < 0 ? array.length - (fromIndex * -1) : fromIndex
    for (l; l < array.length; l++) {
      if (array[l] === value) return l
    }
    return -1
  }

  function initial(array) {
    array.length = array.length - 1
    return array
  }

  function reverse(array) {
    let l = 0,
      r = array.length - 1,
      temp
    while (l < r) {
      temp = array[l]
      array[l] = array[r]
      array[r] = temp
      l++
      r--
    }
    return array
  }

  function every(array, f) {
    if (typeof (f) == 'function') {
      if (!array[0]) return true
      for (let i = 0; i < array.length; i++) {
        if (!f(array[i])) return false
      }
      return true
    } else if (Array.isArray(f)) {
      for (let i = 0; i < array.length; i++) {
        for (let j in array[i]) {
          if (array[i][f[0]] !== f[1]) return false
        }
        return true
      }
    } else if (typeof (f) == 'object') {
      for (let i = 0; i < array.length; i++) {
        for (let j in array[i]) {
          if (!f[j] || array[i][j] !== f[j]) return false
        }
      }
      return true
    } else {
      for (let i = 0; i < array.length; i++) {
        for (j in array[i]) {
          if (!array[i][f]) return false
        }
      }
      return true
    }
  }

  function filter(array, f) {
    let res = []
    if (typeof (f) == 'function') {
      for (let i = 0; i < array.length; i++) {
        if (f(array[i])) res.push(array[i])
      }
    } else if (Array.isArray(f)) {
      for (let i = 0; i < array.length; i++) {
        if (array[i][f[0]] == f[1]) {
          res.push(array[i])
        }
      }
    } else if (typeof (f) == 'object') {
      for (let i = 0; i < array.length; i++) {
        let flag = 1
        for (let j in f) {
          if (!array[i][j] || array[i][j] !== f[j]) {
            flag = 0
            break
          }
        }
        if (flag) {
          res.push(array[i])
        }
      }
    } else {
      for (let i = 0; i < array.length; i++) {
        if (array[i][f]) {
          res.push(array[i])
        }
      }
    }
    return res
  }

  function find(array, f) {
    if (typeof (f) == 'function') {
      for (let i = 0; i < array.length; i++) {
        if (f(array[i])) return array[i]
      }
      return -1
    } else if (Array.isArray(f)) {
      for (let i = 0; i < array.length; i++) {
        for (let j in array[i]) {
          if (array[i][f[0]] == f[1]) return array[i]
        }
      }
      return -1
    } else if (typeof (f) == 'object') {
      for (let i = 0; i < array.length; i++) {
        let flag = 1
        for (let j in f) {
          if (!array[i][j] || array[i][j] !== f[j]) {
            flag = 0
            continue
          }
        }
        if (flag) return array[i]
      }
      return -1
    } else {
      for (let i = 0; i < array.length; i++) {
        for (j in array[i]) {
          if (array[i][f]) return array[i]
        }
      }
      return -1
    }
  }

  function toArray(value) {
    let res = []
    if (value !== value) {
      return res
    } else if (typeof (value) == 'object') {
      if (Array.isArray(value)) {
        return value
      } else {
        for (let i in value) {
          res.push(value[i])
        }
      }
    } else if (typeof (value) == 'number') {
      return res
    } else if (typeof (value) == 'string') {
      for (let i = 0; i < value.length; i++) {
        res.push(value[i])
      }
    } else {
      return res
    }
    return res
  }

  function min(array) {
    if (!array[0]) return undefined
    let m = array[0]
    for (let i = 1; i < array.length; i++) {
      m = array[i] < m ? array[i] : m
    }
    return m
  }

  function minBy(array, f) {
    let res = []
    let m
    if (typeof (f) == 'function') {
      m = 0
      for (let i = 0; i < array.length; i++) {
        res.push(f(array[i]))
        m = res[i] < res[m] ? i : m
      }
      return array[m]
    } else {
      m = Infinity
      for (let i = 0; i < array.length; i++) {
        m = array[i][f] < m ? i : m
      }
      return array[m]
    }
  }

  function max(array) {
    let sum = array[0]
    array.forEach((a) => {
      sum = a > sum ? a : sum
    });
    return sum
  }

  function maxBy(array, f) {
    let res = []
    let m
    if (typeof (f) == 'function') {
      m = 0
      for (let i = 0; i < array.length; i++) {
        res.push(f(array[i]))
        m = res[i] > res[m] ? i : m
      }
      return array[m]
    } else {
      m = array[0]
      for (let i = 1; i < array.length; i++) {
        m = array[i][f] > m[f] ? array[i] : m
      }
      return m
    }
  }

  function sum(array) {
    let s = 0
    array.forEach(a => {
      s += a
    })
    return s
  }

  function sumBy(array, f) {
    let s = 0
    if (typeof (f) == 'function') {
      for (let i = 0; i < array.length; i++) {
        s += f(array[i])
      }
      return s
    } else {
      for (let i = 0; i < array.length; i++) {
        s += array[i][f]
      }
      return s
    }
  }

  function differenceBy(array, ...values) {
    let f = arguments[arguments.length - 1]
    let temp = []
    let res = []
    if (typeof (f) == 'function') {
      for (let i = 0; i < values.length - 1; i++) {
        for (let j = 0; j < values.length; j++) {
          temp.push(f(values[i][j]))
        }
      }
      for (let i = 0; i < array.length; i++) {
        if (temp.indexOf(f(array[i])) == -1) {
          res.push(array[i])
        }
      }
      return res
    } else if (typeof (f) == 'string') {
      for (let i = 0; i < values.length - 1; i++) {
        for (let j = 0; j < values[i].length; j++) {
          let t = values[i][j][f]
          temp.push(t)
        }
      }
      for (let i = 0; i < array.length; i++) {
        if (temp.indexOf(array[i][f]) == -1) {
          res.push(array[i])
        }
      }
      return res
    } else {
      return difference(array, ...values)
    }
  }

  function differenceWith(array, values, f) {
    let res = []
    for (let i = 0; i < array.length; i++) {
      let flag = 1
      for (let j = 0; j < values.length; j++) {
        if (f(array[i], values[j])) {
          flag = 0
        }
      }
      if (flag) res.push(array[i])
    }
    return res
  }

  function dropRightWhile(array, args) {
    let f = i2(args)
    for (let i = array.length - 1; i >= 0; i--) {
      if (f(array[i])) {
        array.pop()
      } else {
        return array
      }
    }
  }

  function dropWhile(array, args) {
    let f = i2(args)
    while (array[0]) {
      if (f(array[0])) {
        array.shift()
      } else {
        break
      }
    }
    return array
  }

  function intersection(...array) {
    return array[0].filter((a, index) => {
      if (array[1].indexOf(a) == -1) {
        return false
      } else {
        return true
      }
    })
  }

  function intersectionBy(array, array1, iteratee) {
    let f = i(iteratee)
    let temp = array1.map((a, b) => f(a))
    return array.filter((a, b) => {
      if (temp.indexOf(f(a)) == -1) {
        return false
      } else {
        return true
      }
    })
  }

  function intersectionWith(...array) {
    let comparator = arguments[arguments.length - 1]
    let res = []
    array[1].forEach((a, b, arr) => {
      res = res.concat(array[0].filter((c, d, ar) => comparator(a, c)))
    })
    return res
  }

  function nth(array, n = 0) {
    if (n < 0) n = array.length + n
    return array[n]
  }

  function pull(array, ...values) {
    remove(array, function (a, b, c) {
      return values.indexOf(a) !== -1
    })
    return array
  }

  function pullAll(array, values) {
    remove(array, function (a, b, c) {
      return values.indexOf(a) !== -1
    })
    return array
  }

  function pullAllBy(array, values, iteratee) {
    return array.filter((a) => values.map((b) => b[iteratee]).indexOf(a[iteratee]) == -1)
  }

  function pullAllWith(array, values, comparator) {
    return array.filter((b) => !comparator(...values, b))
  }

  function sortedIndex(array, value) {
    if (array[0] > value) return 0
    if (array[array.length - 1] < value) return array.length
    let l = 0,
      r = array.length - 1,
      pivot
    while (l <= r) {
      pivot = Math.floor(l + (r - l) / 2)
      if (value === array[pivot]) {
        let i = pivot
        while (array[i] == value) {
          i--
        }
        return i + 1
      } else if (value > array[pivot]) {
        l = pivot + 1
      } else {
        r = pivot - 1
      }
    }
    return pivot
  }


  function sortedIndexBy(array, value, iteratee) {
    let f = i(iteratee)
    let temp = array.map((a) => f(a))
    return sortedIndex(temp, f(value))
  }

  function sortedIndexOf(array, value) {
    if (array[0] > value) return 0
    if (array[array.length - 1] < value) return array.length
    let l = 0,
      r = array.length - 1,
      pivot
    while (l <= r) {
      pivot = Math.floor(l + (r - l) / 2)
      if (value === array[pivot]) {
        let i = pivot
        while (array[i] == value) {
          i--
        }
        return i + 1
      } else if (value > array[pivot]) {
        l = pivot + 1
      } else {
        r = pivot - 1
      }
    }
    return -1
  }

  function sortedLastIndex(array, value) {
    if (array[0] > value) return 0
    if (array[array.length - 1] < value) return array.length
    let l = 0,
      r = array.length - 1,
      pivot
    while (l <= r) {
      pivot = Math.floor(l + (r - l) / 2)
      if (value === array[pivot]) {
        let i = pivot
        while (array[i] == value) {
          i++
        }
        return i
      } else if (value > array[pivot]) {
        l = pivot + 1
      } else {
        r = pivot - 1
      }
    }
    return pivot
  }

  function sortedLastIndexBy(array, value, iteratee) {
    let f = i2(iteratee)
    let a = array.map((a) => f(a))
    let b = f(value)
    return sortedLastIndex(a, b)
  }


  function sortedLastIndexOf(array, value) {
    if (array[0] > value) return 0
    if (array[array.length - 1] < value) return array.length
    let l = 0,
      r = array.length - 1,
      pivot
    while (l <= r) {
      pivot = Math.floor(l + (r - l) / 2)
      if (value === array[pivot]) {
        let i = pivot
        while (array[i] == value) {
          i++
        }
        return i - 1
      } else if (value > array[pivot]) {
        l = pivot + 1
      } else {
        r = pivot - 1
      }
    }
    return -1
  }

  function sortedUniq(array) {
    return array.filter((a, b, c) => a !== c[b + 1])
  }

  function sortedUniqBy(array, iteratee) {
    let f = i2(iteratee)
    let temp = []
    let res = []
    let m = array.map((a) => f(a))
    array.forEach((a, b, c) => {
      if (temp.indexOf(f(a)) == -1) {
        temp.push(f(a))
        res.push(a)
      }
    })
    return res
  }

  function tail(array) {
    for (let i = 0; i < array.length; i++) {
      array[i] = array[i + 1]
    }
    array.pop()
    return array
  }

  function take(array, n = 1) {
    return array.filter((_, b) => b < n)
  }

  function takeRight(array, n = 1) {
    return array.filter((_, b) => b >= array.length - n)
  }

  function takeRightWhile(array, predicate) {
    let f = i2(predicate)
    let res = []
    for (let i = array.length - 1; i >= 0; i--) {
      if (f(array[i])) {
        res.unshift(array[i])
      } else {
        break
      }
    }
    return res
  }

  function takeWhile(array, predicate) {
    let f = i2(predicate)
    let res = []
    for (let i = 0; i < array.length; i++) {
      if (f(array[i])) {
        res.push(array[i])
      } else {
        break
      }
    }
    return res
  }

  function union(...array) {
    let temp = concat(...array)
    let res = []
    temp.forEach((a) => {
      if (res.indexOf(a) == -1) {
        res.push(a)
      }
    })
    return res
  }

  function unionBy(...array) {
    let temp = array[array.length - 1]
    array.pop()
    m = concat(...array)
    return sortedUniqBy(m, temp)
  }

  function unionWith(...array) {
    let f = i2(array[array.length - 1])
    let a1 = array[0]
    let a2 = array[1]
    a1.forEach((a) => {
      a2.forEach((b, c, d) => {
        if (f(a, b)) {
          d[c] = 0 //直接b = 0 无效
        }
      })
    })
    return remove(concat(a1, a2), (a) => a == 0)
  }

  function uniq(array) {
    let res = []
    array.forEach((a, b, c) => {
      if (res.indexOf(a) == -1) {
        res.push(a)
      }
    })
    return res
  }

  function uniqBy(array, iteratee) {
    let f = i2(iteratee)
    let res = []
    let arr = []
    let temp = array.map((a) => f(a))
    temp.forEach((a, b, c) => {
      if (arr.indexOf(a) == -1) {
        arr.push(a)
        res.push(array[b])
      }
    })
    return res
  }

  function uniqWith(array, comparator) {
    let f = i2(comparator)
    let res = []
    array.forEach((a, b, c) => {
      for (let i = b; i < array.length; i++) {
        if (f(a, array[i])) {
          continue
        } else {
          res.push(c[b])
        }
      }
    })
    return res
  }

  function unzip(array) {
    return array[0].map((_, c) => array.map((b) => b[c]))
  }

  function unzipWith(array, comparator) {
    let f = i2(comparator)
    return array[0].map((_, i) => array.reduce((sum, b, c, d) => {
      return f(sum, b[i])
    }, 0))
  }

  function without(array, ...values) {
    return array.filter((a, b, c) => {
      if (values.includes(a)) {
        return false
      } else return true
    })
  }

  function xor(...array) {
    return flattenDeep(array).filter((a, b, c) => sli(flattenDeep(array).slice(), b, 1).indexOf(a) == -1)
  }

  function xorBy(...values) {
    let f = i2(values.pop())
    return flattenDeep(values).filter((a, b) => sli(flattenDeep(values).map((x) => f(x)), b, 1).indexOf(f(a)) == -1)
  }

  function xorWith(...array) {
    let f = i2((array.pop()))
    return flattenDeep(array).filter((a, b, c) => sli(flattenDeep(array), b, 1).every(x => !f(a, x)))
  }

  function zip(...array) {
    return array[0].map((_, b) => array.map(a => a[b]))
  }

  function zipObject(...array) {
    let res = {}
    array[0].forEach((a, b, c) => res[a] = array[1][b])
    return res
  }

  function zipWith(...array) {
    let f = i2(array.pop())
    let res = array[0].map((_, b) => array.map((d) => d[b]))
    return res.map((a) => {
      let temp = []
      a.forEach(b => {
        temp.push(b)
      })
      return f(...temp)
    })
  }

  function countBy(collection, iteratee) {
    let f = i2(iteratee)
    let res = {}
    collection.forEach((a, b, c) => {
      if (f(a) in res) {
        res[f(a)]++
      } else {
        res[f(a)] = 1
      }
    })
    return res
  }

  function findLast(array, predicate, index = array.length - 1) {
    let f = i2(predicate)
    for (let i = index; i >= 0; i--) {
      if (f(array[i])) return array[i]
    }
    return -1
  }

  function flatMap(array, iteratee) {
    let f = i2(iteratee)
    let res = []
    array.forEach((a, b, c) => {
      res = res.concat(f(a, b, c))
    })
    return res
  }

  function flatMapDeep(array, iteratee) {
    let f = i2(iteratee)
    return flattenDeep(array.map((a, b, c) => f(a, b, c)))
  }

  function flatMapDepth(array, iteratee, depth = 1) {
    let f = i2(iteratee)
    let res = array.map((a, b, c) => f(a, b, c))
    return flattenDepth(res, depth)
  }

  function forEach(array, iteratee) {
    let f = i2(iteratee)
    for (let i in array) {
      if (!f(array[i], i, array)) {
        break
      }
    }
    return array
  }

  function forEachRight(array, iteratee) {
    return forEach(array.reverse(), i2(iteratee)).reverse()
  }

  function groupBy(array, iteratee = it => it) {
    let f = i2(iteratee)
    let res = {}
    array.forEach((a, b, c) => {
      if (f(a) in res) {
        res[f(a)].push(a)
      } else {
        res[f(a)] = [a]
      }
    })
    return res
  }

  function includes(collection, value, fromIndex = 0) {
    if (type(collection) == 'array') {
      if (fromIndex < 0) {
        fromIndex = collection.length + fromIndex
      }
      for (let i = fromIndex; i < collection.length; i++) {
        if (collection[i] == value) return true
      }
      return false
    } else if (type(collection) == 'object') {
      for (let i in collection) {
        if (collection[i] == value) {
          return true
        }
      }
      return false
    } else if (type(collection) == 'string') {
      if (fromIndex < 0) {
        fromIndex = collection.length + fromIndex
      }
      for (let i = fromIndex; i < collection.length; i++) {
        if (collection[i] == value[0]) {
          let flag = 1
          for (let j = 1; j < value.length; j++) {
            if (collection[i + j] !== value[j]) {
              flag = 0
              break
            }
          }
          if (flag) {
            return true
          }
        }
      }
      return false
    }
  }

  function invokeMap(array, f, ...args) {
    if (type(f) == 'function') {
      return array.map(a => f.call(a, ...args))
    } else {
      return array.map(a => a[f].apply(a, ...args))
    }
  }

  // function sort() {
  //   return this.sort((a, b) => a - b)
  // }

  // function invokeMap(array, f, ...args) { // ????
  //   return array.map(a => f.call(a, ...args))
  // }

  function keyBy(array, iteratee) {
    let f = i2(iteratee)
    let res = {}
    array.forEach(a => res[f(a)] = a)
    return res
  }

  function map(array, iteratee) {
    let f = i2(iteratee)
    let res = []
    if (type(array) == 'object') {
      for (let i in array) {
        res.push(f(array[i], i, array))
      }
    } else if (type(array) == 'array') {
      for (let i = 0; i < array.length; i++) {
        res.push(f(array[i], i, array))
      }
    }
    return res
  }

  function orderBy(array, iteratee, orders) {
    if (type(iteratee) !== 'array') iteratee = [iteratee]
    if (type(orders) !== 'array') orders = [orders]
    let res = array.slice()
    for (let i = iteratee.length - 1; i >= 0; i--) {
      let f = i2(iteratee[i])
      let o = orders[i]
      if (type(f(array[0])) == 'string') {
        res = o == 'asc' ? res.sort((a, b) => f(a).charCodeAt(0) - f(b).charCodeAt(0)) : res.sort((a, b) => f(b)
          .charCodeAt(0) - f(a).charCodeAt(0))
      } else {
        res = o == 'asc' ? res.sort((a, b) => f(a) - f(b)) : res.sort((a, b) => f(b) - f(a))
      }
    }
    return res
  }
  return {
    orderBy,
    map,
    keyBy,
    invokeMap,
    includes,
    groupBy,
    forEachRight,
    forEach,
    flatMapDepth,
    flatMapDeep,
    flatMap,
    findLast,
    countBy,
    zipWith,
    zipObject,
    zip,
    xorWith,
    xorBy,
    xor,
    without,
    unzipWith,
    unzip,
    uniqWith,
    uniqBy,
    uniq,
    unionWith,
    unionBy,
    union,
    takeWhile,
    takeRightWhile,
    takeRight,
    take,
    tail,
    sortedUniqBy,
    sortedUniq,
    sortedLastIndexOf,
    sortedLastIndexBy,
    sortedLastIndex,
    sortedIndexOf,
    sortedIndexBy,
    pullAllWith,
    pullAllBy,
    pullAll,
    pull,
    nth,
    intersectionWith,
    intersectionBy,
    intersection,
    dropWhile,
    dropRightWhile,
    differenceWith,
    differenceBy,
    sumBy,
    sum,
    maxBy,
    max,
    minBy,
    min,
    toArray,
    find,
    filter,
    every,
    sortedIndex,
    reverse,
    initial,
    indexOf,
    head,
    fromPairs,
    flattenDepth,
    flattenDeep,
    flatten,
    findLastIndex,
    findIndex,
    fill,
    dropRight,
    drop,
    lastIndexOf,
    last,
    join,
    difference,
    concat,
    compact,
    chunk
  }
}()