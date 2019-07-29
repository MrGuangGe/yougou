export const request = (params) => {
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
            }
        })
    })
}