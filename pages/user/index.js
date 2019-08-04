import { getStorageSyncUserInfo } from "../../utils/storage.js"

Page({
  data: {
    userInfo: {}
  },
  onShow() {
    // 1 获取缓存中的用户信息
    const userInfo = getStorageSyncUserInfo()
    // 1.1 判断用户信息是否存在
    if (!userInfo) {
      // 还没有用户信息
      wx.navigateTo({
        url: "/pages/login/index"
      })
      return
    }
    this.setData({ userInfo })
  }
})

/*
1 打开页面的时候 判断缓存中有没有用户信息
  1 没有 跳转到登录页面进行登录
    1 登录页面会执行获取用户信息
    2 存入到本地存储中
    3 还需要重新跳转回来
  2 有用户信息 页面渲染即可
 */