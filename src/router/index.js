import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/homePage'
import Welcome from '@/components/project/welcome'
import AdminUserList from '@/components/project/adminSystem/adminUserList'
import AdminPermission from '@/components/project/adminSystem/adminPermission'
import RoleConfig from '@/components/project/adminSystem/roleConfig'
import RechargeOrder from '@/components/project/dataManage/rechargeOrder'
// 例子
import HomeExample from '@/components/homeExample'
import Paging from '@/components/example/paging'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: HomePage,
      children: [
        {
          path: '/',
          name: 'welcome',
          component: Welcome
        },
        {
          path: '/adminUserList',
          name: 'adminUserList',
          component: AdminUserList
        },
        {
          path: '/adminPermission',
          name: 'adminPermission',
          component: AdminPermission
        },
        {
          path: '/roleConfig',
          name: 'roleConfig',
          component: RoleConfig
        },
        {
          path: '/rechargeOrder',
          name: 'rechargeOrder',
          component: RechargeOrder
        }
      ]
    },
    { // 例子
      path: '/example',
      name: 'example',
      component: HomeExample,
      children: [
        {
          path: '/example/paging',
          name: 'paging',
          component: Paging
        }
      ]
    }
  ]
})
