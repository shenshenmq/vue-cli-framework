/**
 * Created by pc on 2018/1/24.
 */

// 判断数组中是否存在某元素
const checkIsValueInArr = function (val, arr) {
  let len = arr.length
  for (let i = 0; i < len; i++) {
    if (arr[i] === val) {
      return {
        isExist: true,
        index: i
      }
    }
  }
  return {
    isExist: false
  }
}
// 去除数组中的元素（通过数组）
// let a = ['1','2','3','4','5']
// let b = ['2','4']
// wipeOffRepeatValueByArr(a, b)
// console.log(a)  // ['1','3','5']
const wipeOffRepeatValueByArr = function (a, b) {
  let len = b.length
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < len; j++) {
      if (a[i] === b[j]) {
        a.splice(i, 1)
      }
    }
  }
  console.log(a)
  return a
}
// 数组转字符串
const ArrayToString = function (arr) {
  let len = arr.length
  let Str = ''
  for (let i = 0; i < len - 1; i++) {
    Str += arr[i] + ','
  }
  Str += arr[len - 1]
  return Str
}

export { checkIsValueInArr, wipeOffRepeatValueByArr, ArrayToString }
