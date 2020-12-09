var coder_shui = function () {
  function chunk(array,size) {
    if (array.length < size) {
      return array
    }
    let temp
    let arr = []
    let i = 0
    while (i < array.length){
      temp = size
      let t = []
      while (temp) {
        if(array[i])t.push(array[i])
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
      if(array[i]) res.push(array[i])
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
      }else if(arguments[i] !== undefined && arguments[i] !== null && arguments[i] == arguments[i]) arr.push(arguments[i])
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
  function join(array ,sep) {
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
  function lastIndexOf(array,value, fromIndex = array.length - 1) {
    for (let i = fromIndex; i >= 0; i--) {
      if (array[i] === value)return i
    }
    return -1
  }
  function drop(array,n = 1) {
    let res = []
    for (let i = n; i < array.length; i++) {
      res.push(array[i])
    }
    return res
  }
  function dropRight(array,n = 1) {
    let res = []
    for (let i = 0; i < array.length - n; i++) {
      res.push(array[i])
    }
    return res
  }
  function fill(array,value, s = 0, e = array.length - 1) {
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
  function findIndex(array, f , fromIndex = 0) {
    if (typeof (f) == 'function') {
      for (let i = fromIndex; i < array.length; i++) {
        if (f( array[i])) return i        
      }
      return -1
    }else if (Array.isArray(f)) {
      for (let i = fromIndex; i < array.length; i++) {
        for (let j in array[i]) {
          if (f[0] == j && f[1] == array[i][j]) return i
        }
      }
      return -1
    }else if (typeof (f) == 'object') {
      for (let i = fromIndex; i < array.length; i++) {
        for (let j in array[i]) {
          if (f[j] && array[i][j] == f[j]) return i
        }
      }
      return -1
    } else if (typeof (f) == 'string') {
      for (let i = fromIndex; i < array.length; i++) {
        for (let j in array[i]) {
          if (j == f || array[i][j] == f) return i
        }
      }
      return -1
    }
  }
  function findLastIndex(array, f , fromIndex = array.length - 1) {
    if (typeof (f) == 'function') {
      for (let i = fromIndex; i >= 0; i--) {
        if (f( array[i])) return i        
      }
      return -1
    }else if (Array.isArray(f)) {
      for (let i = fromIndex; i >= 0; i--) {
        for (let j in array[i]) {
          if (f[0] == j && f[1] == array[i][j]) return i
        }
      }
      return -1
    }else if (typeof (f) == 'object') {
      for (let i = fromIndex; i >= 0; i--) {
        for (let j in array[i]) {
          if (f[j] && array[i][j] == f[j]) return i
        }
      }
      return -1
    } else if (typeof (f) == 'string') {
      for (let i = fromIndex; i >= 0; i--) {
        for (let j in array[i]) {
          if (j == f || array[i][j] == f) return i
        }
      }
      return -1
    }
  }
  function flatten(array) {
    let res = []
    let flag = 0
    for (let i = 0; i < array.length; i++) {
      if (Array.isArray(array[i]) && flag == 0) { 
        for (let j = 0; j < array[i].length; j++) {
          res[res.length] = array[i][j]
          flag = 1
        }
      }else res[res.length] = array[i]
    }
    return res
  }
  function flattenDeep(array) {
    let res = []
    if (!Array.isArray(array)) return array
    for (let i = 0; i < array.length; i++) {
      if (Array.isArray(array[i])) {
        coder_shui.concat(res,flattenDeep(array[i]))
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
      }else res[array[i][0]] = array[i][1]
    }
    return res
  }
  function head(array) {
    return array[0]
  }
  function indexOf(array,value, fromIndex = 0) {
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
    let l = 0,r = array.length - 1,temp
    while (l < r) {
      temp = array[l]
      array[l] = array[r]
      array[r] = temp
      l++
      r--
    }
    return array
  }
  function sortedIndex(array, value) {
    if (array[0] > value) return 0
    if( array[array.length - 1] < value) return array.length
    let l = 0, r = array.length - 1,pivot
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
  function every(array, f) {
    if (typeof (f) == 'function') {      
      if (! array[0]) return true
      for (let i = 0; i < array.length; i++) {
        if ( !f(array[i])) return false
      }
      return true
    } else if (Array.isArray(f)) {
      for (let i = 0; i < array.length; i++) {
        for (let j in array[i]) {
          if (array[i][f[0]] !== f[1])return false
        }
        return true
      }
    } else if (typeof (f) == 'object') {
      for (let i = 0; i < array.length; i++) {
        for (let j in array[i]) {
          if (f[j] && array[i][j] == f[j]) return true
        }
      }
      return false
    } else {
      for (let i = 0; i < array.length; i++) {
        for (j in array[i]) {
          if (!array[i][f]) return false
        }
      }
      return true
    }
  }
  function filter(array,f) {
    let res = []
    if (typeof (f) == 'function') {
      for (let i = 0; i < array.length; i++) {
        if (f(array[i])) res.push(array[i])
      }
    } else if (Array.isArray(f)) {
      for (let i = 0; i < array.length; i++) {
        for (let j in array[i]) {
          if (array[i][f[0]] == f[1]) {
            res.push(array[i])
          }
        }
      }
    } else if (typeof (f) == 'object') {
      for (let i = 0; i < array.length; i++) {
        for (let j in array[i]) {
          if (f[j] && array[i][j] == f[j]) {
            res.push( array[i])
          }
        }
      }
    } else {
      for (let i = 0; i < array.length; i++) {
        for (j in array[i]) {
          if (array[i][f]){
            res.push(array[i])
          }
        }
      }
    }
    return res      
  }
  function find(array, f) {
    if (typeof (f) == 'function') {      
      for (let i = 0; i < array.length; i++) {
        if ( f(array[i])) return array[i]
      }
      return -1
    } else if (Array.isArray(f)) {
      for (let i = 0; i < array.length; i++) {
        for (let j in array[i]) {
          if (array[i][f[0]] == f[1])return array[i]
        }
        return -1
      }
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
    }else if (typeof(value) == 'object') {
      if (Array.isArray(value)) {
        return value
      } else {
        for (let i in value) {
          res.push(value[i])
        }
      }
    } else if (typeof(value) == 'number') {
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
    if( !array[0] ) return undefined
    let m = array[0]
    for (let i = 1; i < array.length; i++) {
      m = array[i] < m  ? array[i] : m
    }
    return m
  }
  function minBy(array, f ) {
    let res = []
    let m = Infinity
    if (typeof (f) == 'function') {
      for (let i = 0; i < array.length; i++) {
        res.push(f(array[i]))
        m = res[i] < res[m] ? i : m
      }
      return array[m]
    } else {
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
  function maxBy(array,f) {
    let res = []
    let m = -Infinity
    if (typeof (f) == 'function') {
      for (let i = 0; i < array.length; i++) {
        res.push(f(array[i]))
        m = res[i] > res[m] ? i : m
      }      
      return res[m]
    } else {
      for (let i = 0; i < array.length; i++) {
        for (let j in array[i]) {
          m = array[i][j] > m ? array[i][j] : m
        }
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
          sum += f(array[i])
      }
      return sum
    } else {
      for (let i = 0; i < array.length; i++) {
        sum += array[i][f]
      }
      return sum
    }
  }
  return {
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