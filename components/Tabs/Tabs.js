// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击调用父组件的方法
    handleSendIndex(event) {
      // console.log(event)
      const { index } = event.currentTarget.dataset
      this.triggerEvent("AcceptIndex", { index })
    }
  }
})
