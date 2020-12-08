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

  return {
    concat,
    compact,
    chunk
}
}()