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
  }
})