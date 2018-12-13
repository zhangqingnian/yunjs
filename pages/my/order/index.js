// pages/my/order/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        res: [
            {
                orderType: 1,
                iphone: '0574-88480555',
                time: '2018/11/10',
                address: '上海蕊目马术俱乐部',
                project: '马术'
            },
            {
                orderType: 2,
                iphone: '0574-88480555',
                address: '上海蕊目游泳馆',
                name: '游泳月卡'
            },
            {
                orderType: 3,
                iphone: '0574-88480555',
                address: '上海蕊目俱乐部',
                name: '羽毛球门票'
            },
            {
                orderType: 4,
                iphone: '0574-88480555',
                address: '上海蕊目',
                name: '瑜伽课'
            },
            {
                orderType: 1,
                iphone: '0574-88480555',
                time: '2018/11/10',
                address: '上海蕊目马术俱乐部',
                project: '马术'
            }
        ],
        unpaid: true,
        paid:false,
        cancel:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    //待支付
    onUnpaid() {
        this.setData({
            unpaid: true,
            paid: false,
            cancel: false
        })
    },
    //已支付
    onPaid() {
        this.setData({
            unpaid: false,
            paid: true,
            cancel: false
        })
    },
    //已取消
    onCancel() {
        this.setData({
            unpaid: false,
            paid: false,
            cancel: true
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        console.log('上拉加载')
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})