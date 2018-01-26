<template>
  <div class="layout">
    <Layout :style="{minHeight: '100vh'}">
      <Header style="z-index: 1;">
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo"></div>
          <div class="layout-nav">
            <MenuItem name="1">
              <Icon type="ios-navigate"></Icon>
              Item 1
            </MenuItem>
            <MenuItem name="2">
              <Icon type="ios-keypad"></Icon>
              Item 2
            </MenuItem>
            <MenuItem name="3">
              <Icon type="ios-analytics"></Icon>
              Item 3
            </MenuItem>
            <MenuItem name="4">
              <Icon type="ios-paper"></Icon>
              Item 4
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu active-name="1-2" theme="light" width="auto" :open-names="['1']">
            <Submenu name="1">
              <template slot="title">
                <Icon type="ios-navigate"></Icon>
                小例子
              </template>
              <MenuItem name="1-1" v-on:click.native="route('/example/paging')">分页</MenuItem>
              <MenuItem name="1-2">Option 2</MenuItem>
              <MenuItem name="1-3">Option 3</MenuItem>
              <MenuItem name="1-4">Option 4</MenuItem>
            </Submenu>
            <Submenu name="2">
              <template slot="title">
                <Icon type="ios-keypad"></Icon>
                Item 2
              </template>
              <MenuItem name="2-1">Option 1</MenuItem>
              <MenuItem name="2-2">Option 2</MenuItem>
            </Submenu>
            <Submenu name="3">
              <template slot="title">
                <Icon type="ios-analytics"></Icon>
                Item 3
              </template>
              <MenuItem name="3-1">Option 1</MenuItem>
              <MenuItem name="3-2">Option 2</MenuItem>
            </Submenu>
            <Submenu name="4">
              <template slot="title">
                <Icon type="ios-analytics"></Icon>
                Item 4
              </template>
              <MenuItem name="4-1">Option 1</MenuItem>
              <MenuItem name="4-2">Option 2</MenuItem>
            </Submenu>
          </Menu>
        </Sider>
        <Layout :style="{padding: '0'}">
          <Breadcrumb :style="{margin: '4px 24px'}" >
            <!--<BreadcrumbItem>Home</BreadcrumbItem>-->
            <!--<BreadcrumbItem>Components</BreadcrumbItem>-->
            <!--<BreadcrumbItem>Layout</BreadcrumbItem>-->
            <BreadcrumbItem v-for="x in breadcrumb" v-bind:key="x">{{x}}</BreadcrumbItem>
          </Breadcrumb>
          <Content :style="{padding: '12px 24px', height: '280px', background: '#fff'}">
            <router-view></router-view>
          </Content>
          <div>
            <p style="text-align: center;color:#999;">Copyright©2014-2017 XXXX公司 版权所有 浙ICP备xxxxxx</p>
          </div>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>
<script>
  export default {
    name: 'homePage',
    data () {
      return {
        breadcrumb: ['Home', 'Components', 'Layout']    // 面包屑导航
      }
    },
    methods: {
      route: function (urlPath) {
        this.$router.push(urlPath)
      }
    }
  }
</script>
<style scoped>
  .layout{
    /*border: 1px solid #d7dde4;*/
    background: #f5f7f9;
    position: relative;
    /*border-radius: 4px;*/
    overflow: hidden;
  }
  .layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
  }
  .layout-nav{
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
  }
  .ivu-layout-sider{
    box-shadow: 0 0 1px 3px #eee;
  }
  .ivu-menu-vertical.ivu-menu-light:after{
    width: 0;
  }
  .ivu-layout-content{
    overflow-y: scroll;
  }
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  .ivu-layout-content::-webkit-scrollbar
  {
    width: 8px;
    height: 8px;
    background-color: #F5F5F5;
  }
  /*定义滚动条轨道 内阴影+圆角*/
  .ivu-layout-content::-webkit-scrollbar-track
  {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
    background-color: #F5F5F5;
  }
  /*定义滑块 内阴影+圆角*/
  .ivu-layout-content::-webkit-scrollbar-thumb
  {
    border-radius: 6px;
    background-color: #888;
    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);
  }
</style>
