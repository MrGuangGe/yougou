/**
 * 把分类的数据存入到本地存储
 * @param {Object} obj
 */
export const setStorageSyncCategories = (obj) => {
    wx.setStorageSync("categoriesData", obj)
}

/**
 * 获取分类在本地存储中的数据
 */
export const getStorageSyncCategories = () => {
    return wx.getStorageSync("categoriesData")
}


/**
 * 把购物车的数据存入到本地存储
 * @param {Object} obj
 */
export const setStorageSyncCart = (obj) => {
    wx.setStorageSync("cartData", obj)
}

/**
 * 获取购物车在本地存储中的数据
 */
export const getStorageSyncCart = () => {
    return wx.getStorageSync("cartData")
}


/**
 * 把地址的数据存入到本地存储
 * @param {Object} obj
 */
export const setStorageSyncAddress = (obj) => {
    wx.setStorageSync("addressData", obj)
}

/**
 * 获取地址在本地存储中的数据
 */
export const getStorageSyncAddress = () => {
    return wx.getStorageSync("addressData")
}

/**
 * 把token存入到本地存储
 * @param {String} str
 */
export const setStorageSyncToken = (str) => {
    wx.setStorageSync("tokenData", str)
}

/**
 * 获取token在本地存储中的数据
 */
export const getStorageSyncToken = () => {
    return wx.getStorageSync("tokenData")
}

/**
 * 把用户信息存入到本地存储
 * @param {Object} obj
 */
export const setStorageSyncUserInfo = (obj) => {
    wx.setStorageSync("userData", obj)
}

/**
 * 获取用户信息在本地存储中的数据
 */
export const getStorageSyncUserInfo = () => {
    return wx.getStorageSync("userData")
}