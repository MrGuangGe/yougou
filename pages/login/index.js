import { setStorageSyncUserInfo } from "../../utils/storage.js"
Page({
  handleGetUserInfo(event) {
    setStorageSyncUserInfo(event.detail.userInfo)
    // 1 跳转回上一页
    wx.navigateBack({
      delta: 1
    })
  }
})