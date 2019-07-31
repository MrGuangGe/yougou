// 引入封装好的发送异步请求的方法 promise
import { request } from "../../request/index.js"

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 商品详情数据
    goodsDetailList: []
  },
  // 商品id
  goods_id: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 通过形参options获取url上的参数-商品id
    this.goods_id = options.goods_id
    this.getGoodsDetailData()
  },
  // 获取商品详情的数据
  getGoodsDetailData() {
    let goods_id = this.goods_id
    request({
      url: "/goods/detail",
      method: "GET",
      data: { goods_id }
    })
      .then(res => {
        // console.log(res.data)
        this.setData({
          goodsDetailList: res.data.message
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
})