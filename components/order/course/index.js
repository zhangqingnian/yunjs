// components/order/course/index.js
Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
  /**
   * 组件的属性列表
   */
  properties: {
      order:Object
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
      onDel() {
          this.triggerEvent('del', this.properties.order, {})
      },
      onPay() {
          this.triggerEvent('pay', this.properties.order, {})
      },
      onRefund() {
          this.triggerEvent('refund', this.properties.order, {})
      },
      onGoOrder() {
          this.triggerEvent('goOrder', this.properties.order, {})
      }
  }
})
