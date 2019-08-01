Page({
  data: {
    // 商品信息
    goodsInfo: []
  },
  onLoad: function (options) {
    // 获取商品信息的业务处理
    let data = wx.getStorageSync("cart_add")
    // 因为商品的属性名为数字 需要遍历对象并且把属性值放到一个数组中
    let arr = Object.keys(data).map(item => data[item])
    // 把数据赋值给data中的goodsInfo
    this.setData({
      goodsInfo: arr
    })
  },
  // 添加收货地址
  addAddress() {
    // 获取用户权限信息 用来判断用户信息是否授权了
    wx.getSetting({
      success: (res) => {
        // 1.以下代码表示已经授权了
        if (res.authSetting["scope.address"] === true || res.authSetting["scope.address"] === undefined) {
          // 直接获取用户收货地址就好
          wx.chooseAddress({
            success: (res) => {
              console.log(res)
            }
          })
        } else {
          // 2 没有授权的话 需要诱导用户打开授权信息
          wx.openSetting({
            success: (res) => {
              console.log(res)
            }
          })
        }
      }
    })
  }
})

/*
res.authSetting[scope.address]
1 点击按钮 获取收货地址
  1 wx.chooseAddress -> 弹出对话框
    1 点击确定  直接获取值就ok
    2 点击取消  次再点击 就没有任何效果
  1 先获取用户对该小程序的授予权限的信息  getSetting
    1 已经授权了
      用户点击了确定按钮 授权返回值是true   直接调用收货地址接口代码即可
    2 没有授权
      用户从来没有点击过按钮 授权返回值是undefined
      用户点击了取消按钮 授权返回值是false
  2 假设授权信息是 true 或者是 undefined
    直接调用获取收货地址的api
  2 假设授权信息是 false（用户明确不授权）
    1 诱导用户 打开授权页面--- wx.openSetting  等用户重新给与权限之后
    2 再调用获取收货地址
 */