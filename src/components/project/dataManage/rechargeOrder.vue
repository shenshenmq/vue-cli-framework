<template>
    <div>
      <template>
        <Form :model="formItem" :label-width="80">
          <Row>
            <Col span="12">
              <FormItem label="日期">
                <DatePicker type="date" :value="formItem.startTime" @on-change="formItem.startTime=$event" :options="dateOptions" placeholder="起始日期" style="width: 200px"></DatePicker>
                <Button type="info">至</Button>
                <DatePicker type="date" :value="formItem.endTime" @on-change="formItem.endTime=$event" :options="dateOptions" placeholder="结束日期" style="width: 200px"></DatePicker>
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem label="消费方式">
                <Select v-model="formItem.purpose">
                  <Option value="0">---请选择---</Option>
                  <Option value="1">---常规充值---</Option>
                  <Option value="2">---活动充值---</Option>
                  <Option value="3">---升级尊享卡---</Option>
                </Select>
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
                <Radio label="1">成功</Radio>
                <Radio label="2">待回执</Radio>
              </RadioGroup>
            </Col>
            <Col span="12" style="display: flex;justify-content: flex-end;">
              <Button type="success" @click="exportExcel()" style="margin-left: 12px;">导出EXcel</Button>
              <Button type="primary" icon="ios-search" @click="getList()" style="margin-left: 12px;">搜索</Button>
            </Col>
          </Row>
        </template>
      </div>
      <!--表格-->
      <div class="list">
        <template v-if="count">
          <!--table列表-->
          <Table :loading="loading" :columns="columnsTitle" :data="columnsItems" ref="table" stripe></Table>
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
    </div>
</template>
<script>
  export default {
    name: '',
    data () {
      return {
        radioVal: '0',
        formItem: {}, // 搜索条件
        dateOptions: { // 日期插件（只能选择当前日期之前的）
          disabledDate (date) {
            return date && date.valueOf() > Date.now() - 86400000
          }
        },
        // 已下列表分页
        pageSize: 20, // 每页显示20条数据
        currentPage: 1, // 当前页码
        count: 0,  // 总记录数
        loading: false,   // 列表数据加载中
        columnsItems: [], // 列表数据
        columnsTitle: [   // 列表标题
          {title: '序号', type: 'index', align: 'center'},
          {title: '编号', key: 'no', align: 'center'},
          {title: '对方订单号', key: 'thirdPartyNo', align: 'center'},
          {title: '洗衣卡编号', key: 'cardNo', align: 'center'},
          {title: '充值金额', key: 'amount', align: 'center'},
          {title: '到账金额', key: 'creditedAmount', align: 'center'},
          {title: '赠送金额', key: 'bounus', align: 'center'},
          { title: '用途',
            key: 'purpose',
            align: 'center',
            render: (h, params) => {
              let allPurpose = ['', '常规充值', '活动充值', '升级尊享卡']
              return allPurpose[params.row.purpose]
            }
          },
          { title: '充值方式',
            key: 'method',
            align: 'center',
            render: (h, params) => {
              let allMethod = ['', '支付宝', '微信', '网银']
              return allMethod[params.row.method]
            }},
          { title: '充值状态',
            key: 'status',
            align: 'center',
            render: (h, params) => {
              let allStatus = ['', '常规充值', '活动充值', '升级尊享卡']
              return allStatus[params.row.status]
            }},
          {title: '充值后余额', key: 'afterBalance', align: 'center'},
          {title: '学校名字', key: 'collegeName', align: 'center'},
          {title: '时间', key: 'modifyTime', align: 'center'}
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
        let url = '/wsmanagement/order/recharge/find'
        this.formItem.begin = this.pageSize * (this.currentPage - 1)
        this.formItem.rows = this.pageSize
        if (this.formItem.purpose === '0') {
          delete this.formItem.purpose
        }
        let postData = this.formItem
        console.log(postData)
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
          delete this.formItem.status
        } else {
          this.formItem.status = da
        }
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
      },
      exportExcel () {
        let url = '/wsmanagement/order/recharge/find'
        this.formItem.begin = 0
        this.formItem.rows = 9999
        if (this.formItem.purpose === '0') {
          delete this.formItem.purpose
        }
        let postData = this.formItem
        console.log(postData)
        this.$http.post(url, postData, {'emulateJSON': true, 'emulateHTTP': true})
          .then(({body}) => {
            // 子组件监听到count变化会自动更新DOM
            console.log(body)
            this.$refs.table.exportCsv({
              filename: '充值升级记录.csv',
              columns: this.columnsTitle,
              data: body.content
            })
          })
      }
    }
  }
</script>
