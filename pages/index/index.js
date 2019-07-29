Page({
  data: {
    // 轮播图的数据
    swiperList: []
  },
  onLoad: function (options) {
    this.getSwiperList()
  },
  // 发送请求获取轮播图数据
  getSwiperList(){
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
  }
})