// 引入封装好的发送异步请求的方法 promise
import { request } from "../../request/index.js"

Page({
  data: {
    // tabs栏的数据
    tabs: [
      {
        id: 1,
        value: "综合",
        isActive: true
      },
      {
        id: 2,
        value: "销量",
        isActive: false
      },
      {
        id: 3,
        value: "价格",
        isActive: false
      }
    ],
    // 商品列表的数据
    goodsList: []
  },
  // 页面加载触发
  onLoad: function (options) {
    // 通过形参options获取到url上的参数
    // console.log(options)
    this.queryParams.cid = options.cid

    this.getGoodsList()
  },
  // 发送请求商品列表需要带上的参数
  queryParams: {
    query: "",
    cid: 1,
    pagenum: 1,
    pagesize: 10
  },
  // 获取商品列表的数据
  getGoodsList() {
    request({
      url: "/goods/search",
      method: "GET",
      data: this.queryParams
    })
      .then(res => {
        // console.log(res.data)
        this.setData({
          goodsList: res.data.message.goods
        })
      })
      .catch(err => {
        console.log(err)
      })
  },
  // 子组件调用这个函数
  handleAcceptIndex(event) {
    // console.log(event)
    const { index } = event.detail
    // 获取源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs
    })
  },
  // 下拉刷新触发
  onPullDownRefresh: function () {

  },
  // 滚动条触底触发
  onReachBottom: function () {

  },
})