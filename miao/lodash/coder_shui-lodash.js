let coder_shui = function () {
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



  return {
    chunk
}
}()