/**
 * Created by pc on 2018/1/25.
 */
import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)

const getCollegeList = function () {
  return Vue.http.post('/wsmanagement/map/college').then(({body}) => {
    return body
  })
}

export { getCollegeList }
