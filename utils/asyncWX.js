/**
 * wx.wxlogin
 */
export const wxlogin = () => {
    return new Promise((resolve, reject) => {
        wx.login({
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}

/**
 * 调用微信系统内的支付（会扣钱哦！）
 * @param {object} pay 支付要的参数对象
 */
export const requestPayment = (pay) => {
    return new Promise((resolve, reject) => {
        wx.requestPayment({
            ...pay,
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}

/**
 * wx.showToast
 */
export const showToast = ({ title }) => {
    return new Promise((resolve, reject) => {
        wx.showToast({
            title: title,
            icon: 'none',
            image: '',
            duration: 1500,
            mask: false,
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}
