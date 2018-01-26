<template>
    <div>
        <!--搜索-->
        <div style="margin: 12px 0;">
            <template>
                <Row>
                    <Col span="24" style="display: flex;justify-content: flex-end;">
                    <Button type="primary" @click="addModalShow = true" style="margin-left: 12px;">新增</Button>
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
        </div>
        <!--新增-->
        <template>
            <Modal
                    v-model="addModalShow"
                    title="添加"
                    :loading="addLoading"
                    @on-ok="addOk"
                    @on-cancel="addCancel">
                <Form :model="addFormItem" :label-width="80">
                    <FormItem label="xxx">
                        <Input v-model="addFormItem.no" placeholder="请输入内容..."></Input>
                    </FormItem>
                </Form>
            </Modal>
        </template>
    </div>
</template>
<script>
  export default {
    name: '',
    data () {
      return {
        addModalShow: false,
        addLoading: true,
        addFormItem: {},
        // 已下列表分页
        pageSize: 20, // 每页显示20条数据
        currentPage: 1, // 当前页码
        count: 0,  // 总记录数
        loading: false,   // 列表数据加载中
        columnsItems: [], // 列表数据
        columnsTitle: [   // 列表标题
          {title: '序号', type: 'index', align: 'center'},
          {title: '名称', key: 'name', align: 'center'},
          {
            title: '操作',
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
                      console.log('修改')
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
                      console.log('删除')
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
    methods: {
      // 获取数据
      getList () {
        this.loading = true  // 打开列表数据加载中动画
        //
        let url = '/wsmanagement/admin/account/find'
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
      addOk () {
        // this.addLoading = false
        // this.(() => { this.addLoading = true })
        // 上面代码防止点击后按钮出现loading, 解决点击后就不能再点击
        // 下面代码成功之后做的操作
        this.addModalShow = false
        this.addFormItem = {}  // 初始化
        this.$Message.success('添加成功')
        this.getList()  // 重新查询
      },
      addCancel () {
        this.$Message.info('取消添加')
      }
    }
  }
</script>
