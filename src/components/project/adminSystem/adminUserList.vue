<template>
    <div id="adminUserList">
      <template>
        <Form :model="formItem" :label-width="80">
          <Row>
            <Col span="6">
              <FormItem label="账号">
                <Input v-model="formItem.account" placeholder="请输入内容搜索..."></Input>
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem label="学校">
                <Select v-model="formItem.collegeNo">
                  <Option value="">---请选择学校---</Option>
                  <Option v-for="x in collegeList" :value="x.no" :key="x.no">{{x.name}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem label="商户名">
                <Input v-model="formItem.customerName" placeholder="请输入内容搜索..."></Input>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </template>
      <!--搜索-->
      <div style="margin: 12px 0;">
        <template>
          <Row>
            <Col span="12">
              <RadioGroup v-model="radioVal" type="button" @on-change="selectData">
                <Radio label="0">全部</Radio>
                <Radio label="1">佰米</Radio>
                <Radio label="2">学校</Radio>
                <Radio label="3">供应商</Radio>
              </RadioGroup>
            </Col>
            <Col span="12" style="display: flex;justify-content: flex-end;">
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
  import { getCollegeList } from '../../../api/commonApi'
  export default {
    name: '',
    data () {
      return {
        radioVal: '0',
        formItem: {},  // 搜索条件
        collegeList: [], // 学校列表
        //
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
    mounted: function () {
      getCollegeList().then(body => {
        console.log(body)
        this.collegeList = body.object
      })
    },
    methods: {
      // 获取数据
      getList () {
        this.loading = true  // 打开列表数据加载中动画
        //
        let url = '/wsmanagement/admin/account/find'
        this.formItem.begin = this.pageSize * (this.currentPage - 1)
        this.formItem.rows = this.pageSize
        let postData = this.formItem
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
      selectData (da) {
        console.log(da)
        if (da === '0') {
          delete this.formItem.type
        } else {
          this.formItem.type = da
        }
        this.getList()
      },
      addOk () {
        this.addLoading = false
        this.$nextTick(() => { this.addLoading = true })
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
