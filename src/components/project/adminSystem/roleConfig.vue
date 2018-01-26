<template>
    <div id="roleConfig">
      <div style="margin: 12px 0;">
        <template>
          <Row>
            <Col span="24" style="display: flex;justify-content: flex-end;">
            <Button type="primary"  @click="addModalShow = true" style="margin-left: 12px;">新增</Button>
            <Button type="primary" icon="ios-search" @click="getList()" style="margin-left: 12px;">搜索</Button>
            </Col>
          </Row>
        </template>
      </div>
      <!--表格-->
      <div class="list">
        <template v-if="count">
          <!--table列表-->
          <Table :loading="loading" :columns="columnsTitle" :data="columnsItems" stripe></Table>
          <!--分页-->
          <div style="display: flex; justify-content: flex-end;margin: 12px 0;">
            <Page :total="count" :page-size='pageSize' @on-change="pageChange" show-total show-elevator></Page>
          </div>
        </template>
        <template v-if="!count">
          <Alert show-icon>
            没有搜索到数据！
            <template slot="desc">哎呀，数据藏到哪里去了呢？大家赶快去找一找呀！</template>
          </Alert>
        </template>
      </div>

      <!--新增-->
      <template>
        <Modal
          v-model="addModalShow"
          title="添加权限"
          :loading="addLoading"
          @on-ok="addOk"
          @on-cancel="addCancel">
          <Form :model="addFormItem" :label-width="40">
            <FormItem label="名称">
              <Input v-model="addFormItem.name" placeholder="请输入内容..."></Input>
            </FormItem>
            <div class="allCheckItem" v-for="x in parentRoles">
              <template>
                <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange" >
                  <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                    <Checkbox
                      :label="x.id"
                      @click.prevent.native="handleCheckAll(x.id)">{{x.id}}{{x.name}}</Checkbox>
                  </div>
                  <div class="checkItem" v-for="c in gainChildrenRoles(x.id)" :key="c.id">
                    <Checkbox :label="c.id">
                      {{c.id}}{{c.name}}
                    </Checkbox>
                  </div>
                </CheckboxGroup>
              </template>
            </div>
            <FormItem label="备注">
              <Input v-model="addFormItem.remark" placeholder="请输入内容..."></Input>
            </FormItem>
          </Form>
        </Modal>
      </template>
      <!--修改-->
      <template>
        <Modal
          v-model="modifyModalShow"
          title="修改权限"
          :loading="modifyLoading"
          @on-ok="modifyOk"
          @on-cancel="modifyCancel">
          <Form :model="modifyFormItem" :label-width="40">
            <FormItem label="名称">
              <Input v-model="modifyFormItem.name" placeholder="请输入内容..."></Input>
            </FormItem>
            <div class="allCheckItem" v-for="x in parentRoles">
              <template>
                <CheckboxGroup v-model="checkAllGroupModify" @on-change="checkAllGroupChange" >
                  <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                    <Checkbox
                      :label="x.id"
                      @click.prevent.native="handleCheckAllModify(x.id)">{{x.id}}{{x.name}}</Checkbox>
                  </div>
                  <div class="checkItem" v-for="c in gainChildrenRoles(x.id)" :key="c.id">
                    <Checkbox :label="c.id">
                      {{c.id}}{{c.name}}
                    </Checkbox>
                  </div>
                </CheckboxGroup>
              </template>
            </div>
            <FormItem label="备注">
              <Input v-model="modifyFormItem.remark" placeholder="请输入内容..."></Input>
            </FormItem>
          </Form>
        </Modal>
      </template>
      <!--删除-->
      <template>
        <Modal v-model="deleteModalShow" width="360">
          <p slot="header" style="color:#f60;text-align:center">
            <Icon type="information-circled"></Icon>
            <span>删除确认</span>
          </p>
          <div style="text-align:center">
            <p>此任务删除后，可能会出现权限问题。</p>
            <p>是否继续删除？</p>
          </div>
          <div slot="footer">
            <Button type="error" size="large" @click="deleteOk()" long>删除</Button>
          </div>
        </Modal>
      </template>
    </div>
</template>
<script>
  import { checkIsValueInArr, wipeOffRepeatValueByArr, ArrayToString } from '../../../util/array'
  export default {
    name: '',
    data () {
      return {
        // 多选框 新增的
        checkAllGroup: [], // 全部选中的值（数组）
        addModalShow: false,
        addLoading: true,
        addFormItem: {},
        // 多选框 修改的
        checkAllGroupModify: [], // 全部选中的值（数组）
        modifyModalShow: false,
        modifyLoading: true,
        modifyFormItem: {},
        deleteModalShow: false,
        deleteId: null,   // deleteById

        // 权限列表
        parentRoles: [],
        childrenRoles: [],
        // 已下列表分页
        pageSize: 20, // 每页显示20条数据
        currentPage: 1, // 当前页码
        count: 0,  // 总记录数
        loading: false,   // 列表数据加载中
        columnsItems: [], // 列表数据
        columnsTitle: [   // 列表标题
          {title: '序号', type: 'index', align: 'center'},
          {title: '名称', key: 'name', align: 'center'},
          {title: '备注', key: 'remark', align: 'center'},
          { title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      console.log(params)
                      this.modifyFormItem = {
                        id: params.row.id,
                        name: params.row.name,
                        remark: params.row.remark
                      }
                      this.checkAllGroupModify = params.row.permission.split(',')
                      this.modifyModalShow = true
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.deleteId = params.row.id
                      this.deleteModalShow = true
                    }
                  }
                }, '删除')
              ])
            }
          }
        ]
      }
    },
    created: function () {
      // 请求第一页数据
      this.getList()
    },
    mounted: function () {
      let url = '/wsmanagement/map/permission'
      this.$http.post(url, {'emulateJSON': true, 'emulateHTTP': true})
        .then(({body}) => {
          console.log(body.object)
          let rolesArr = body.object
          let self = this
          rolesArr.forEach(function (item, index) {
            if (item.parentId === '0') {
              self.parentRoles.push(item)
            } else {
              self.childrenRoles.push(item)
            }
          })
          console.log(this.parentRoles)
          console.log(this.childrenRoles)
        })
    },
    methods: {
      // 获取数据
      getList () {
        this.loading = true  // 打开列表数据加载中动画
        // 模拟
        let url = '/wsmanagement/admin/role/find'
        let postData = {
          begin: this.pageSize * (this.currentPage - 1),
          rows: this.pageSize
        }
        this.$http.post(url, postData, {'emulateJSON': true, 'emulateHTTP': true})
          .then(({body}) => {
            // 子组件监听到count变化会自动更新DOM
            console.log(body)
            this.count = body.count   // 列表数据总条数
            this.columnsItems = body.content   // 列表数据内容
            this.loading = false  // 关闭列表数据加载中动画
          })
      },
      // 从page组件传递过来的当前page
      pageChange (page) {
        console.log('当前页码：' + page)
        this.currentPage = page
        this.getList()
      },
      // 获取父权限对应的子权限的对象数组(通过父权限Id)
      gainChildrenRoles (id) {
        let childrenRoles = []
        this.childrenRoles.forEach(function (item, index) {
          if (item.parentId === id) {
            childrenRoles.push(item)
          }
        })
        return childrenRoles
      },
      addOk () {
        this.addLoading = false
        this.$nextTick(() => { this.addLoading = true })
        // 上面代码防止点击后按钮出现loading, 解决点击后就不能再点击
        let url = '/wsmanagement/admin/role/save'
        this.addFormItem.permission = ArrayToString(this.checkAllGroup)
        let postData = this.addFormItem
        this.$http.post(url, JSON.stringify(postData), {'emulateJSON': true, 'emulateHTTP': true})
          .then(({body}) => {
            console.log(body)
            if (body.status === 'success') {
              this.addModalShow = false
              this.addFormItem = {}  // 初始化
              this.checkAllGroup = []  // 初始化
              this.$Message.success('添加成功')
              this.getList()  // 重新查询
            } else {
              this.$Message.error(body.message)
            }
          })
      },
      addCancel () {
        this.$Message.info('取消添加')
      },
      handleCheckAll (id) {  // 父权限Id  全选，取消全选（新增）
        console.log(id)
        let objArr = this.gainChildrenRoles(id)  // 对象数组
        console.log(objArr)
        let checkAllArr = objArr.map(function (item, index, arr) {
          return item.id
        })
        checkAllArr.unshift(id)  // 将id也存入数组（也就是勾选）
        //
        let returnObj = checkIsValueInArr(id, this.checkAllGroup)
        console.log(returnObj)
        if (returnObj.isExist) {
          console.log('去除勾选')
          this.checkAllGroup = wipeOffRepeatValueByArr(this.checkAllGroup, checkAllArr)
          console.log(this.checkAllGroup)
        } else {
          this.checkAllGroup = this.checkAllGroup.concat(checkAllArr)
          console.log(this.checkAllGroup)
        }
      },
      checkAllGroupChange (data) {  // 选择子的单个框的时候触发的
        console.log(data)
      },
      modifyOk () {
        this.addLoading = false
        this.$nextTick(() => { this.addLoading = true })
        // 上面代码防止点击后按钮出现loading, 解决点击后就不能再点击
        let url = '/wsmanagement/admin/role/editById'
        this.modifyFormItem.permission = ArrayToString(this.checkAllGroupModify)
        let postData = this.modifyFormItem
        console.log(postData)
        this.$http.post(url, JSON.stringify(postData), {'emulateJSON': true, 'emulateHTTP': true})
          .then(({body}) => {
            console.log(body)
            if (body.status === 'success') {
              this.modifyModalShow = false
              this.modifyFormItem = {}  // 初始化
              this.checkAllGroupModify = []  // 初始化
              this.$Message.success('修改成功')
              this.getList()  // 重新查询
            } else {
              this.$Message.error(body.message)
            }
          })
      },
      modifyCancel () {
        this.$Message.info('取消修改')
      },
      handleCheckAllModify (id) {  // 父权限Id  全选，取消全选（修改）
        console.log(id)
        let objArr = this.gainChildrenRoles(id)  // 对象数组
        console.log(objArr)
        let checkAllArr = objArr.map(function (item, index, arr) {
          return item.id
        })
        checkAllArr.unshift(id)  // 将id也存入数组（也就是勾选）
        //
        let returnObj = checkIsValueInArr(id, this.checkAllGroupModify)
        console.log(returnObj)
        if (returnObj.isExist) {
          console.log('去除勾选')
          this.checkAllGroupModify = wipeOffRepeatValueByArr(this.checkAllGroupModify, checkAllArr)
          console.log(this.checkAllGroupModify)
        } else {
          this.checkAllGroupModify = this.checkAllGroupModify.concat(checkAllArr)
          console.log(this.checkAllGroupModify)
        }
      },
      deleteOk () {
        let url = '/wsmanagement/admin/role/deleteById'
        let postData = {
          id: this.deleteId
        }
        this.$http.post(url, postData, {'emulateJSON': true, 'emulateHTTP': true})
          .then(({body}) => {
            console.log(body)
            if (body.status === 'success') {
              this.deleteModalShow = false
              this.$Message.success('删除成功')
              this.getList()  // 重新查询
            } else {
              this.$Message.error('删除失败')
            }
          })
      }
    }
  }
</script>
<style scoped>
  .allCheckItem{
    border: 1px solid #eee;
    padding: 4px;
    border-radius: 4px;
    margin-bottom: 24px;
  }
  .checkItem{
    display: inline-flex;
    width:33.3%;
  }
</style>
