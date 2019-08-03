// 引入封装好的发送异步请求的方法 promise
import { request } from "../../request/index.js"

Page({
  data: {
    goodsDetailList: {}
  },
  // 商品的完整信息
  goodsInfo: {},
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
            // 因为iphone手机不支持.webp后缀的图片 所以最好把.webp改为.jpg/.png
            goods_introduce: res.data.message.goods_introduce.replace(/\.webp/g, ".jpg")
          }
        })

        // 把请求回来的数据赋值给全局变量goodsInfo
        this.goodsInfo = res.data.message
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
  },
  // 点击加入购物车
  cartAdd() {
    // 1.判断本地存储中是否存在这份数据了 
    // 该份数据要么有数据 要么是个空对象（第一次添加到本地存储中肯定是没有数据的 需要手动添加一个空对象）
    let cartAdd = wx.getStorageSync("cart_add") || {}
    // 2.添加商品 存在与否
    if (cartAdd[this.goodsInfo.goods_id]) {
      // 数据存在
      cartAdd[this.goodsInfo.goods_id].num++
    } else {
      // 数据不存在
      // 新增数据
      cartAdd[this.goodsInfo.goods_id] = this.goodsInfo
      // 添加一个num属性 以备后续对商品进行++操作
      cartAdd[this.goodsInfo.goods_id].num = 1
      // 添加一个checked属性 以备后续描述商品复选框的状态
      cartAdd[this.goodsInfo.goods_id].checked = true
    }

    // 3.把数据保存到本地
    wx.setStorageSync("cart_add", cartAdd)
    wx.showToast({
      title: '添加成功',
      icon: 'none',
      // 添加遮罩层 弹窗时用户无法操作页面的按钮
      mask: true
    })
  }
})

/*
--点击 "加入购物车"
  1 绑定点击事件
  2 加入购物车的存储通过 本地存储实现
    {
      商品A的id:{商品A的属性-数量},
      商品B的id:{商品B的属性-数量},
    }
  3 第一次点击加入按钮
    1 获取本地存储中的购物车数据 肯定是对象格式   wx.getStorageSync("cart")||{};
    2 判断一下该商品是否已经存在于 购物车数据中，
      1 不存在
        a）给该商品对象添加一个 数量属性 =1
        b）把该对象存入到本地存储
        c）弹出了一个提示框 mask:true
      1 已经存在了  获取到本地存储中的该商品对象 对数量++
        把该对象存入到本地存储
*/