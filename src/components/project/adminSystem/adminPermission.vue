<template>
  <div id="addminPermission">
    <!--搜索-->
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
    <!--modal-->
    <!--新增-->
    <template>
      <Modal
        v-model="addModalShow"
        title="添加权限"
        :loading="addLoading"
        @on-ok="addOk"
        @on-cancel="addCancel">
          <Form :model="addFormItem" :label-width="80">
            <FormItem label="权限资源key">
              <Input v-model="addFormItem.no" placeholder="请输入内容..."></Input>
            </FormItem>
            <FormItem label="权限名称">
              <Input v-model="addFormItem.name" placeholder="请输入内容..."></Input>
            </FormItem>
            <FormItem label="备注">
              <Input v-model="addFormItem.remark" placeholder="请输入内容..."></Input>
            </FormItem>
            <FormItem label="权限等级">
              <RadioGroup v-model="addDefaultLevel">
                <Radio label="1">菜单级</Radio>
                <Radio label="2">按钮级</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="所属菜单级" v-if="addDefaultLevel === '2'">
              <Select v-model="addFormItem.parentId">
                <Option value="" disabled selected>选择所属菜单级</Option>
                <Option v-for="x in permissions" :value="x.id" :key="x.id">
                  {{x.name}}
                </Option>
              </Select>
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
        <Form :model="modifyFormItem" :label-width="80">
          <FormItem label="权限资源key">
            <Input v-model="modifyFormItem.no" placeholder="请输入内容..."></Input>
          </FormItem>
          <FormItem label="权限名称">
            <Input v-model="modifyFormItem.name" placeholder="请输入内容..."></Input>
          </FormItem>
          <FormItem label="备注">
            <Input v-model="modifyFormItem.remark" placeholder="请输入内容..."></Input>
          </FormItem>
          <FormItem label="权限等级">
            <RadioGroup v-model="modifyDefaultLevel">
              <Radio label="1">菜单级</Radio>
              <Radio label="2">按钮级</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="所属菜单级" v-if="modifyDefaultLevel === '2'">
            <Select v-model="modifyFormItem.parentId">
              <Option value="" disabled selected>选择所属菜单级</Option>
              <Option v-for="x in permissions" :value="x.id" :key="x.id">
                {{x.name}}
              </Option>
            </Select>
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
  import { checkEmpty } from '../../../util/tips'
  export default {
    name: 'test',
    data () {
      return {
        addModalShow: false,
        addLoading: true,
        addDefaultLevel: '1',
        addFormItem: {},
        modifyModalShow: false,
        modifyLoading: true,
        modifyDefaultLevel: '1',
        modifyFormItem: {},
        deleteModalShow: false,
        deleteId: null,   // deleteById
        permissions: [],  // 权限列表
        // 已下列表分页
        pageSize: 20, // 每页显示20条数据
        currentPage: 1, // 当前页码
        count: 0,  // 总记录数
        loading: false,   // 列表数据加载中
        columnsItems: [], // 列表数据
        columnsTitle: [   // 列表标题
          {title: '序号', type: 'index', align: 'center'},
          {title: '名称', key: 'name', align: 'center'},
          {title: '编号', key: 'no', align: 'center'},
          { title: '父级权限',
            key: 'parentId',
            align: 'center',
            render: (h, params) => {
              return this.getParentPermissionName(params.row.parentId)
            }
          },
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
                        no: params.row.no,
                        name: params.row.name,
                        remark: params.row.remark,
                        parentId: params.row.parentId
                      }
                      if (params.row.parentId === 0) {
                        this.modifyDefaultLevel = '1'
                      } else {
                        this.modifyDefaultLevel = '2'
                      }
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
          } // 按钮
        ]
      }
    },
    created: function () {
      // 请求第一页数据
      this.getList()
    },
    mounted: function () {
      console.log('------mounted------')
      let url = '/wsmanagement/admin/permission/menu/find'
      this.$http.post(url, {'emulateJSON': true, 'emulateHTTP': true})
        .then(({body}) => {
          console.log(body)
          this.permissions = body.object   // 列表数据总条数
        })
    },
    methods: {
      // 获取数据
      getList () {
        this.loading = true  // 打开列表数据加载中动画
        //
        let url = '/wsmanagement/admin/permission/find'
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
      // 获取父级权限
      getParentPermissionName (parentId) {
        for (let x in this.permissions) {
          if (parentId === 0) {
            return '无'
          }
          if (this.permissions[x].id === parentId) {
            return this.permissions[x].name
          }
        }
      },
      addOk () {
        this.addLoading = false
        this.$nextTick(() => { this.addLoading = true })
        // 上面代码防止点击后按钮出现loading, 解决点击后就不能再点击
        let arr = []
        if (this.addDefaultLevel === '1') {
          delete this.addFormItem.parentId
          arr = [this.addFormItem.no, this.addFormItem.name, this.addFormItem.remark]
        } else if (this.addDefaultLevel === '2') {
          arr = [this.addFormItem.no, this.addFormItem.name, this.addFormItem.remark, this.addFormItem.parentId]
        }
        console.log(arr)
        let returnObj = checkEmpty(arr)
        console.log(returnObj)
        if (returnObj.isEmpty) {
          this.$Message.info('请填写完全部信息！')
          return
        }
        let url = '/wsmanagement/admin/permission/save'
        let postData = this.addFormItem
        this.$http.post(url, postData, {'emulateJSON': true, 'emulateHTTP': true})
          .then(({body}) => {
            console.log(body)
            if (body.status === 'success') {
              this.addModalShow = false
              this.addFormItem = {}  // 初始化
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
      modifyOk () {
        this.modifyLoading = false
        this.$nextTick(() => { this.modifyLoading = true })
        // 上面代码防止点击后按钮出现loading
        let arr = []
        if (this.modifyDefaultLevel === '1') {
          delete this.modifyFormItem.parentId
          arr = [this.modifyFormItem.no, this.modifyFormItem.name, this.modifyFormItem.remark]
        } else if (this.addDefaultLevel === '2') {
          arr = [this.modifyFormItem.no, this.modifyFormItem.name, this.modifyFormItem.remark, this.modifyFormItem.parentId]
        }
        console.log(arr)
        let returnObj = checkEmpty(arr)
        console.log(returnObj)
        if (returnObj.isEmpty) {
          this.$Message.info('请填写完全部信息！')
          return
        }
        let url = '/wsmanagement/admin/permission/editById'
        let postData = this.modifyFormItem
        this.$http.post(url, postData, {'emulateJSON': true, 'emulateHTTP': true})
          .then(({body}) => {
            console.log(body)
            if (body.status === 'success') {
              this.modifyModalShow = false
              this.$Message.success('修改成功')
              this.getList()  // 重新查询
            } else {
              this.$Message.error('修改失败')
            }
          })
      },
      modifyCancel () {
        this.$Message.info('取消修改')
      },
      deleteOk () {
        let url = '/wsmanagement/admin/permission/deleteById'
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
