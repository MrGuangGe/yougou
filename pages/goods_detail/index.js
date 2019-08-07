// 引入封装好的发送异步请求的方法 promise
import { request } from "../../request/index.js"
// 引入封装好的本地存储的文件
import { setStorageSyncCart, getStorageSyncCart } from "../../utils/storage.js"

Page({
  data: {
    goodsDetailList: {},
    // 是否收藏了商品
    isCollect: false
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
        // 1 判断当前商品是否在缓存 是否被选中收藏
        let collect = wx.getStorageSync("collect") || []
        // 2 isCollect 商品是否被收藏过 
        // some 只要有一个循环项返回true 把么整个循环体则为true
        let isCollect = collect.some(val => val.goods_id === this.goodsInfo.goods_id)
        this.setData({
          goodsDetailList: {
            goods_id: res.data.message.goods_id,
            goods_price: res.data.message.goods_price,
            pics: res.data.message.pics,
            goods_name: res.data.message.goods_name,
            // 因为iphone手机不支持.webp后缀的图片 所以最好把.webp改为.jpg/.png
            goods_introduce: res.data.message.goods_introduce.replace(/\.webp/g, ".jpg")
          },
          isCollect
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
    let cartAdd = getStorageSyncCart() || {}
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
    setStorageSyncCart(cartAdd)
    wx.showToast({
      title: '添加成功',
      icon: 'none',
      // 添加遮罩层 弹窗时用户无法操作页面的按钮
      mask: true
    })
  },
  // 收藏商品的点击事件
  collectGoods() {
    /* 
      0 页面一打开了 应该先判断当前商品有没有被选中
        1 有 让页面反生变化 
      1 存入大量复杂数据的时候 一般是对象/数组  --这里是数组  
      2 获取到 缓存中的数据 collect  || []
      3 把当前商品对象 存入到 数组中
      4 把数组 直接存入到缓存中即可

      1 获取到 缓存中的数据 collect  || []
      2 判断当前商品是否存在于缓存数据中
        1 已经存在 删除数组中的这个数据
        2 未存在 添加到数组即可
      3 根据操作的不同 给出不同的提示
        1 弹窗提示
        2 页面的收藏图标也发生改变 
    */
    let collect = wx.getStorageSync("collect") || []
    // 根据索引判断某个元素是否被收藏
    let index = collect.findIndex(val => val.goods_id === this.goodsInfo.goods_id)
    if (index === -1) {
      // 缓存中没有数据
      collect.push(this.goodsInfo)
      wx.showToast({
        title: '收藏成功',
        icon: 'none',
        mask: true
      })
      this.setData({ isCollect: true })
    } else {
      // 缓存中有数据 点击则代表删除
      collect.splice(index, 1)
      wx.showToast({
        title: '取消收藏',
        icon: 'none',
        mask: true
      })
      this.setData({ isCollect: false })
    }
    // 缓存到本地存储中
    wx.setStorageSync("collect", collect)
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