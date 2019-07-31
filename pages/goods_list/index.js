/* 
  --上拉加载下一页 
      1 什么时候触发上拉加载下一页？ 滚动条触底触发事件 
        onReachBottom 存在于小程序的页面生命周期中！
      2 先判断有没有下一页数据
        1 当前的页码 和 总页数 （未知）
          总页数 = Math.ceil(总的条数 / 页容量 ) 
          当前的页码 >=  总页数  没有下一页数据 
        2 什么地方写获取总页数 
          接口请求成功之后有了total属性之后就可以获取 
      3 有下一页数据 
        pagenum++;
        发送请求。。
          不能再对goodsList全部替换 
          对旧的数组进行拼接 
      4 没有下页
        弹出提示。。
  --下拉刷新
      1 重置 pagenum =1 
      2 重置 data中的数组 goodsList =[]
      3 重新发送请求！！
        1 pagenum =1 
        2 会对goodsList =[] 重新赋值！
      4 当数据请求回来 需要手动的关闭 下拉刷新窗口。。。 wx.stopPullDownRefresh()
--添加一个全局的正在加载中效果
      1 效果是哪个代码决定 wx.showLoading wx.hideLoading
      2 思考在哪里进行调用会比较方便
        -1 axios 请求拦截器 
        0 封装过一个发送请求的代码 request 
        1 发送异步请求之前显示
        2 异步请求成功 就关闭 
--将异步代码改成更加优雅es7中的async语法 
      0 旧版本的微信和旧的手机 直接不要在原生的小程序中使用 es7 的语法！！！
      1 在方法的定义前 加一个 async 
      2 在async描述的方法内 发送的异步代码  在它的前面加一个 await 即可 
      3 容易报一个错误 运行环境不支持 es7 的代码 
      4 会用一个方法 来解决代码中报错的问题
        1 这个方法 不能解决所有的旧手机和旧微信的语法兼容问题 
 */

// 引入封装好的发送异步请求的方法 promise
import { request } from "../../request/index.js"

Page({
  data: {
    // tabs栏的数据
    tabs: [
      {
        id: 1,
        value: "综合",
        isActive: true
      },
      {
        id: 2,
        value: "销量",
        isActive: false
      },
      {
        id: 3,
        value: "价格",
        isActive: false
      }
    ],
    // 商品列表的数据
    goodsList: []
  },
  // 总页数
  pageTotal: 1,
  // 页面加载触发
  onLoad: function (options) {
    // 通过形参options获取到url上的参数
    // console.log(options)
    this.queryParams.cid = options.cid

    this.getGoodsList()
  },
  // 发送请求商品列表需要带上的参数
  queryParams: {
    query: "",
    cid: 1,
    pagenum: 1,
    pagesize: 10
  },
  // 获取商品列表的数据
  getGoodsList() {
    request({
      url: "/goods/search",
      method: "GET",
      data: this.queryParams
    })
      .then(res => {
        // console.log(res.data)
        this.setData({
          // 4.实现上拉加载不能全部替换goodsList 否则前面的数据会丢失 要实行新旧数组的拼接
          goodsList: [...res.data.message.goods, ...this.data.goodsList]
        })
        // 4.数据回来 手动关闭下拉刷新
        wx.stopPullDownRefresh()

        // 1.上拉加载的总页数
        this.pageTotal = Math.ceil(res.data.message.total / this.queryParams.pagesize)
      })
      .catch(err => {
        console.log(err)
      })
  },
  // 子组件调用这个函数
  handleAcceptIndex(event) {
    // console.log(event)
    const { index } = event.detail
    // 获取源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs
    })
  },
  // 下拉刷新触发
  onPullDownRefresh: function () {
    // 1 重置页码
    // 2 重置data中的数组
    // 3 重新发送请求
    // 4 数据回来 手动关闭下拉刷新
    this.queryParams.pagenum = 1
    this.setData({
      goodsList: []
    })
    this.getGoodsList()
  },
  // 滚动条触底触发
  onReachBottom: function () {
    // 2.判断是否有下一页数据
    if (this.queryParams.pagenum >= this.pageTotal) {
      // 弹窗
      wx.showToast({
        title: '没有下一页数据了',
        icon: 'none'
      })
    } else {
      // 3.还有下一页的业务处理
      this.queryParams.pagenum++
      this.getGoodsList()
    }
  },
})