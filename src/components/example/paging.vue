<template>
  <div>
    <div class="list">
      <template v-if="count">
        <Table stripe :columns="columnsTitle" :data="columnsItems"></Table>
        <Page :total="count" :page-size='pageSize' @on-change="pageChange" show-total></Page>
        <!--<mc-paging-->
        <!--:page-size="pageSize"-->
        <!--:page-index="currentPage"-->
        <!--:total="count"-->
        <!--@change="pageChange">-->
        <!--</mc-paging>-->
      </template>
    </div>
  </div>
</template>
<script>
  import Paging from '../common/pagingComponent.vue'
  export default {
    name: 'test',
    data () {
      return {
        pageSize: 20, // 每页显示20条数据
        currentPage: 1, // 当前页码
        count: 0,  // 总记录数
        columnsItems: [], // 列表数据
        columnsTitle: [    // 列表标题
          {title: '序号', type: 'index', align: 'center'},
          {title: '名称', key: 'name', align: 'center'},
          {title: '编号', key: 'no', align: 'center'},
          {title: '父级权限', key: 'parentId', align: 'center'},
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
                      this.show(params.index)
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
                      this.remove(params.index)
                    }
                  }
                }, '删除')
              ])
            }
          }      // 按钮
        ]
      }
    },
    components: {
      'mc-paging': Paging
    },
    mounted: function () {
      console.log('------mounted------')
      // 请求第一页数据
      this.getList()
    },
    methods: {
      // 获取数据
      getList () {
        // 模拟
        let url = `/wsmanagement/admin/permission/find`
        let postData = {
          begin: this.pageSize * (this.currentPage - 1),
          rows: this.pageSize
        }
        this.$http.post(url, postData, {'emulateJSON': true, 'emulateHTTP': true})
          .then(({body}) => {
            // 子组件监听到count变化会自动更新DOM
            console.log(body)
            this.count = body.count
            this.columnsItems = body.content
          })
      },
      // 从page组件传递过来的当前page
      pageChange (page) {
        console.log('当前页码：' + page)
        this.currentPage = page
        this.getList()
      }
    }
  }
</script>
