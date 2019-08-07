// 引入封装好的本地存储的文件
import { getStorageSyncToken } from "../../utils/storage.js"
import { request } from "../../request/index.js"

Page({
  data: {
    // tabs栏的数据
    tabs: [
      {
        id: 1,
        value: "全部",
        isActive: true
      },
      {
        id: 2,
        value: "代付款",
        isActive: false
      },
      {
        id: 3,
        value: "代发货",
        isActive: false
      },
      {
        id: 4,
        value: "退款/退货",
        isActive: false
      }
    ],
    // 所有订单数据
    allOrderList: []
  },
  // 从url上拿到type参数
  onShow: function () {
    // 别的页面跳转到当前页面时候 判断一下是否带有token值了 没有则跳转到授权页面
    const token = getStorageSyncToken()
    if (!token) {
      wx.navigateTo({ url: '/pages/auth/index' })
    }

    // 1.通过页面栈拿到参数  它是一个数组
    // 索引值越大 代表的是越晚打开的页面
    let currentArr = getCurrentPages()
    // console.log(currentArr)
    // 2.拿到当前的页面对象
    let currentObj = currentArr[currentArr.length - 1]
    // console.log(currentObj)
    // 3.可以拿到url上的参数type了
    let { type } = currentObj.options
    // console.log(type)

    // 根据type值 tabs中的菜单激活选中！
    // 根据数据的分析 type-1 才是标题的索引
    let index = type - 1
    this.changeTabsByIndex(index)
    this.getAllOrderList(type, { Authorization: token })
  },
  // 封装一个获取所有订单数据的方法
  getAllOrderList(type, header) {
    // 发送请求 查询所有的订单信息
    request({
      url: "/my/orders/all",
      header,
      type
    })
      .then(res => {
        const { orders } = res.data.message
        // 修改时间的格式
        orders.forEach(val => {
          let date = new Date(val.create_time * 1000)
          val.create_time_cn = date.toLocaleString()
        })
        this.setData({ allOrderList: orders })
      })
      .catch(err => {
        console.log(err)
      })
  },
  // 根据索引切换选中的菜单
  handleAcceptIndex(event) {
    // console.log(event)
    const { index } = event.detail
    this.changeTabsByIndex(index)

    // 1.观察发现 type的值为当前索引加1
    // 2.重新发送请求 获取当前tabs栏的订单数据
    const token = getStorageSyncToken()
    let type = index + 1
    this.getAllOrderList(type, { Authorization: token })
  },
  // 根据索引切换选中的菜单
  changeTabsByIndex(index) {
    // 获取源数组
    let { tabs } = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    this.setData({ tabs })
  }
})