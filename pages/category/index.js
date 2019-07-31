// 引入封装好的发送异步请求的方法 promise
import { request } from "../../request/index.js"

Page({
  data: {
    // 左侧栏数据
    leftList: [],
    // 右侧栏数据
    rightList: [],
    // 初始索引值，为了添加类active的样式给选中的左侧栏
    currentIndex: 0,
    // 改变左侧栏菜单选项 右侧内容置顶
    scrollTop: 0
  },
  // 改变左侧栏菜单选项 右侧内容相应改变
  cates: [],
  onLoad: function (options) {
    /**
     * 实现缓存数据到本地的需求
     * 1、发送请求之前 判断一下本地是否已经存且没有过期的缓存数据
     * 2、发现本地没有数据 发请求获取数据
     * 3、把请求回来的数据缓存到本地上
     * 4、如果缓存到本地上的数据过期了就得重新发请求获取数据
     * 5、发现本地缓存到数据且没有过期则直接使用就好
     */
    // 1、发送请求之前 判断一下本地是否已经存且没有过期的缓存数据
    let cateData = wx.getStorageSync("cateData_storage")
    // console.log(typeof cateData)  // 打印出看到的类型为空字符串 0 null "" false NAN 转bool类型为false
    if (!cateData) {
      // 2、发现本地没有数据 发请求获取数据
      this.getLeftList()
    } else if (Date.now() - cateData.time >= 1000 * 20) {
      // 4、如果缓存到本地上的数据过期了就得重新发请求获取数据
      this.getLeftList()
    } else {
      // 5、发现本地缓存到数据且没有过期则直接使用就好
      this.cates = cateData.data
      // 左侧栏数据
      let leftList = this.cates.map(val => ({ cat_id: val.cat_id, cat_name: val.cat_name }))
      // 右侧栏数据
      let rightList = this.cates[0].children
      this.setData({
        leftList,
        rightList
      })
    }
  },
  // 获取左侧栏数据
  getLeftList() {
    request({
      url: "/categories",
      method: 'GET'
    })
      .then(res => {
        // 把请求回来的数据赋值给全局变量cates
        this.cates = res.data.message
        // 3、把请求回来的数据缓存到本地上
        wx.setStorageSync("cateData_storage", { time: Date.now(), data: this.cates })
        // 左侧栏数据
        let leftList = this.cates.map(val => ({ cat_id: val.cat_id, cat_name: val.cat_name }))
        // 右侧栏数据
        let rightList = this.cates[0].children
        this.setData({
          leftList,
          rightList
        })
      })
      .catch(err => {
        console.log(err)
      })
  },
  // 添加点击事件处理选取左侧栏
  hadChoseItem(event) {
    // console.log(event)
    const { index } = event.currentTarget.dataset
    // 点击左侧菜单项改变右边相应的内容
    let rightList = this.cates[index].children
    this.setData({
      currentIndex: index,
      rightList,
      // 点击左侧栏菜单选项 重新激活scrollTop
      scrollTop: 0
    })
  }
})