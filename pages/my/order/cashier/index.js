// pages/confirmOrder/other/index.js

Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentType: '',
        totalFee:'',
        orderCode:'',
        body:'',      
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let item = JSON.parse(options.item);
        console.log(item);
        this.setData({
            totalFee: item.payment,
            orderCode: item.orderCode,
            body: item.orderMoney,
            orderDifference: item.orderDifference 
        })
        this.orderType(item.orderType)
        console.log(this.data)
    },
    orderType(orderType) {
        console.log(orderType)
        let currentType = '';
        if (orderType == 15) {
            currentType = 'area'
        } else if (orderType == 16) {
            currentType = 'card'
        } else if (orderType == 17) {
            currentType = 'course'
        } else if (orderType == 24) {
            currentType = 'ticket'
        }
        //分销订单
        if (this.data.orderDifference == "MINI_ORDER"){
            currentType = 'share'
        }
        this.setData({
            currentType
        })
    }

})