/* 
1 点击授权按钮
  1 获取用户信息 调用小程序 内置   getUserInfo
     要获取 signature iv rawData encryptedData 4个参数
  2 执行微信小程序登录 wx.login 返回
    code 属性
2 根据以上数据 调用第三方的登录  /users/wxlogin  POST请求
  1 成功之后 返回 用户的token - 令牌 身份证。
  2 把token存入到本地存储中 方便在其他页面使用 
3 重新跳回到上一个页面
 */

// 引入封装好的发送异步请求的方法 promise
import { request } from "../../request/index.js"
import { wxlogin } from "../../utils/asyncWX.js"
import regeneratorRuntime from '../../lib/runtime/runtime.js'
// 引入封装好的本地存储的文件
import { setStorageSyncToken } from "../../utils/storage.js"

Page({
  // 1.获取用户信息
  async getUserInfo(event) {
    try {
      // console.log(event)
      // 1.1 获取用户的 signature iv rawData encryptedData 
      let { signature, iv, rawData, encryptedData } = event.detail
      // 1.2 执行小程序的登录功能
      let { code } = await wxlogin()
      // 1.3 发送请求 获取token
      let params = { signature, iv, rawData, encryptedData, code }
      request({
        url: "/users/wxlogin",
        method: "POST",
        data: params
      })
        .then(res => {
          const { token } = res.data.message
          // 把token值存在本地存储上
          setStorageSyncToken(token)

          // 跳转到上一个页面
          wx.navigateBack({
            // delta 上几个页面
            delta: 1
          })
        })
    } catch (err) {
      console.log(err)
    }
  }
})