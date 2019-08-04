// 引入封装好的本地存储的文件
import { setStorageSyncCart, getStorageSyncCart, getStorageSyncAddress, getStorageSyncToken } from "../../utils/storage.js"

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
    let address = getStorageSyncAddress() || {}
    // 添加一个all属性 用来拼接地址栏
    address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
    // 赋值给data中的address
    this.setData({ address })

    // 从本地存储中获取商品信息
    let cartData = getStorageSyncCart() || {}
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
    setStorageSyncCart(cartData)
  },
  // 支付的点击事件
  pay() {
    const token = getStorageSyncToken()
    // 判断 是否存在token值
    // 1.不存在 跳转到授权页面
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      })
    } else {  // 2. 存在 进行支付的业务处理
      console.log("支付")
    }
  }
})

/*
1 动态渲染的商品应该是 checked=true的这些商品
2 获取订单编号
  1 先获取用户登录的token值
    0 判断有没有token
      1 如果没有token
        0 都是跳转到授权页面 进行获取 成功 再重新跳回支付页面
        1 先获取用户信息
        2 执行小程序登录 获取 code属性
      2 有token 直接走业务流程
 */