/* 
  1 因为首页是同时发送了3个请求出去
  2 当某一个请求回来了就会关闭加载中的弹窗
  3 但是后两个请求还没有回来，页面上已经没有加载中的弹窗了
    所以必须等待3个请求都回来了，再关闭加载中的弹窗！
  */

// 1 同时发送出去的异步请求的个数
let ajaxTimes = 0

export const request = (params) => {
    // 发送请求之前弹窗 加载中
    wx.showLoading({
        title: "加载中"
    })
    // 2.
    ajaxTimes++
    // console.log("发送请求：" + ajaxTimes)
    // 代码优化1
    // 统一的接口的前缀
    const baseUrl = "https://api.zbztb.cn/api/public/v1"
    return new Promise((reslove, reject) => {
        wx.request({
            // 代码优化2
            // 结构传递过来的参数
            ...params,
            // 下面的url会覆盖掉从params结构出来的url
            url: baseUrl + params.url,
            method: 'GET',
            success: (res) => {
                // 成功 调用成功的回调函数
                reslove(res)
            },
            fail: (err) => {
                // 失败 调用失败的回调函数
                reject(err)
            },
            complete: () => {
                // 3.
                ajaxTimes--
                // console.log("请求回来：" + ajaxTimes)
                if (ajaxTimes === 0) {
                    // 请求完成 关闭 加载中的弹窗
                    wx.hideLoading()
                }
            }
        })
    })
}