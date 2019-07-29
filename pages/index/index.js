// 引入封装好的发送异步请求的方法 promise
import { request } from "../../request/index.js"

Page({
  data: {
    // 轮播图的数据
    swiperList: [],
    // 分类导航数据
    navCateList: [],
    // 楼层的数据
    floorList: []
  },
  onLoad: function (options) {
    this.getSwiperList()
    this.getNavCateList()
    this.getFloorList()
  },
  // 发送请求获取轮播图数据
  getSwiperList() {
    request({
      url: '/home/swiperdata',
      method: 'GET'
    })
      .then(res => {
        let { message } = res.data
        this.setData({
          swiperList: message
        })
      })
      .catch(err => {
        console.log(err)
      })
  },
  // 发送请求获取分类导航的数据
  getNavCateList() {
    request({
      url: '/home/catitems',
      method: 'GET'
    })
      .then(res => {
        let { message } = res.data
        this.setData({
          navCateList: message
        })
      })
      .catch(err => {
        console.log(err)
      })
  },
  // 发送请求获取分类导航的数据
  getFloorList() {
    request({
      url: '/home/floordata',
      method: 'GET'
    })
      .then(res => {
        let { message } = res.data
        this.setData({
          floorList: message
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
})