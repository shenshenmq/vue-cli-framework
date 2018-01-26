/**
 * Created by pc on 2018/1/23.
 */

const checkEmpty = function (arr) {
  let len = arr.length
  for (let i = 0; i < len; i++) {
    if (arr[i] === '' || arr[i] === undefined) {
      return {
        isEmpty: true
      }
    }
  }
  return {
    isEmpty: false
  }
}

export { checkEmpty }
