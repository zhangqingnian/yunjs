// pages/my/kechen/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        valid:true,
        invalid:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    //y有效
    onValid() {
        this.setData({
            valid:true,
            invalid:false
        })
    },
    //无效
    onInvalid() {
        this.setData({
            valid: false,
            invalid: true
        })
    }
})