Page({
  data: {
    // 商品信息
    goodsInfo: {},
    // 收货地址
    address: {},
    totalPrice: 0,
    totalNum: 0
  },
  // 页面切换都会触发
  onShow: function () {
    // 从本地存储中获取地址信息
    let address = wx.getStorageSync("address") || {}
    // 添加一个all属性 用来拼接地址栏
    address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
    // 赋值给data中的address
    this.setData({ address })

    // 从本地存储中获取商品信息
    let cartData = wx.getStorageSync("cart_add") || {}
    // 调用setCartGoodsData
    this.setCartGoodsData(cartData)
  },
  // 重置购物车商品信息 计算总价格
  setCartGoodsData(cartData) {
    // 1.把cartData转换为数组
    let cartArr = Object.values(cartData)
    // 2.计算总价格
    let totalPrice = 0
    // 3.计算总数量
    let totalNum = 0
    cartArr.forEach(val => {
      if (val.checked) {
        // 总价格
        totalPrice += val.num * val.goods_price
        // 总数量
        totalNum += val.num
      }
    })
    // 修改data中的数据
    this.setData({ goodsInfo: cartData, totalPrice, totalNum })
    // 防止数据改变了 刷新之后没有效果 所以也顺便存入到缓存中
    wx.setStorageSync('cart_add', cartData)
  },
  // 支付的点击事件
  pay() {
    console.log("支付")
  }
})