Page({
  data: {
    // 轮播图的数据
    swiperList: [],
    // 分类导航数据
    navCateList: []
  },
  onLoad: function (options) {
    this.getSwiperList()
    this.getNavCateList()
  },
  // 发送请求获取轮播图数据
  getSwiperList() {
    wx.request({
      url: 'https://api.zbztb.cn/api/public/v1/home/swiperdata',
      method: 'GET',
      success: (res) => {
        // console.log(res)
        let { message } = res.data
        this.setData({
          swiperList: message
        })
      }
    })
  },
  // 发送请求获取分类导航的数据
  getNavCateList() {
    wx.request({
      url: 'https://api.zbztb.cn/api/public/v1/home/catitems',
      method: 'GET',
      success: (res) => {
        // console.log(res)
        let { message } = res.data
        this.setData({
          navCateList: message
        })
      }
    })
  }
})