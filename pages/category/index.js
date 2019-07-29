Page({
  data: {
    // 左侧栏数据
    leftList: [],
    // 右侧栏数据
    rightList: [],
    // 初始索引值，为了添加类active的样式给选中的左侧栏
    currentIndex: 0
  },
  onLoad: function (options) {
    this.getLeftList()
  },
  // 获取左侧栏数据
  getLeftList() {
    wx.request({
      url: 'https://api.zbztb.cn/api/public/v1/categories',
      method: 'GET',
      success: (res) => {
        // console.log(res.data)
        const { message } = res.data
        // 左侧栏数据
        let leftList = message.map(val => ({ cat_id: val.cat_id, cat_name: val.cat_name }))
        // 右侧栏数据
        let rightList = message[0].children
        this.setData({
          leftList,
          rightList
        })
      }
    })
  },
  // 添加点击事件处理选取左侧栏
  hadChoseItem(event) {
    // console.log(event)
    const { index } = event.currentTarget.dataset
    this.setData({
      currentIndex: index
    })
  }
})