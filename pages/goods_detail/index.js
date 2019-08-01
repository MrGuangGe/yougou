// 引入封装好的发送异步请求的方法 promise
import { request } from "../../request/index.js"

Page({
  data: {
    goodsDetailList: {}
  },
  onLoad: function (options) {
    this.getGoodsDetailData(options.goods_id)
  },
  // 获取商品详情的数据
  getGoodsDetailData(goods_id) {
    request({
      url: "/goods/detail",
      method: "GET",
      data: { goods_id }
    })
      .then(res => {
        // console.log(res.data)
        this.setData({
          goodsDetailList: {
            goods_id: res.data.message.goods_id,
            goods_price: res.data.message.goods_price,
            pics: res.data.message.pics,
            goods_name: res.data.message.goods_name,
            goods_introduce: res.data.message.goods_introduce
          }
        })
      })
      .catch(err => {
        console.log(err)
      })
  },
  // 点击轮播图会全屏预览大图
  previewImage(event) {
    const { pics } = this.data.goodsDetailList
    let urls = pics.map(val => val.pics_big)
    let current = urls[event.currentTarget.dataset.index]
    wx.previewImage({
      urls,     // 需要预览的图片http链接列表
      current   // 当前显示图片的http链接
    })
  }
})