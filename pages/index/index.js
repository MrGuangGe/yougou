Page({
  data: {
    // 轮播图的数据
    swiperList: []
  },
  onLoad: function (options) {
    wx.request({
      url: 'https://api.zbztb.cn/api/public/v1/home/swiperdata',
      header: { 'content-type': 'application/json' },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        // console.log(res)
        let { message } = res.data
        this.setData({
          swiperList: message
        })
      }
    });

  },
  onShow: function () {

  }
})