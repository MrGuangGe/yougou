// 引入封装好的本地存储的文件
import { setStorageSyncCart, getStorageSyncCart, getStorageSyncAddress, getStorageSyncToken } from "../../utils/storage.js"
// 引入封装好的发送异步请求的方法 promise
import { request } from "../../request/index.js"
import { showToast, requestPayment } from "../../utils/asyncWX.js"
import regeneratorRuntime from '../../lib/runtime/runtime.js'

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
  async pay() {
    try {
      const token = getStorageSyncToken()
      // 判断 是否存在token值
      // 1.不存在 跳转到授权页面
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index'
        })
        return
      } else {  // 2. 存在 进行支付的业务处理
        /**
         * 2.1 创建订单  就是获取订单编号order_number
         *    请求头参数：Authorization
         *    请求体参数：order_price、consignee_addr、goods[goods_id,goods_number,goods_price]
         */
        // 2.2 设置请求头
        const header = { Authorization: token }
        // 2.2 获取请求体参数 order_price、consignee_addr、goods[goods_id,goods_number,goods_price]
        // 订单总价格
        const order_price = this.data.totalPrice
        // 收货地址
        const consignee_addr = this.data.address.all
        // 订单数组
        let goods = []
        const { goodsInfo } = this.data
        let cartArr = Object.values(goodsInfo)
        cartArr.forEach(val => {
          if (val.checked) {
            goods.push({
              goods_id: val.goods_id,  // 商品id
              goods_number: val.num,   // 购买商品数量
              goods_price: val.goods_price  // 商品价格
            })
          }
        })
        // 2.3 请求参数合体
        const params = { order_price, consignee_addr, goods }
        // 2.4 发送请求
        const res1 = await request({
          url: "/my/orders/create",
          method: "POST",
          header,
          data: params
        })
        // 拿到订单编号
        let { order_number } = res1.data.message

        /**
         * 3.1 获取支付参数 pay
         *      请求头参数：Authorization
         *      请求体参数：order_number
         */
        // 3.2 发送请求
        const res2 = await request({
          url: "/my/orders/req_unifiedorder",
          method: "POST",
          header,
          data: { order_number }
        })
        const { pay } = res2.data.message

        /**
         * 4.1 调起系统的微信支付就真的会扣钱了 requestPayment()
         */
        await requestPayment(pay)

        /**
         * 5.1 查询订单状态来确认是否真的支付成功
         */
        await request({
          url: "/my/orders/chkOrder",
          method: "POST",
          data: { order_number }
        })
        await showToast({ title: "支付成功！" })
      }
    } catch (err) {
      await showToast({ title: "支付失败！" })
      console.log(err)
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