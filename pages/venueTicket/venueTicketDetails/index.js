// pages/venueTicket/venueTicketDetails/index.js
import {
    config
} from '../../../config.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: config.base_img_url,
        ticket:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        
        let ticket = JSON.parse(options.ticket);
        console.log(ticket)
        this.setData({
            ticket
        })
    },
    onMap(e) {
        console.log(e.currentTarget.dataset);
        let {
            name,
            address,
            lat,
            lon
        } = e.currentTarget.dataset;
        wx.getLocation({ //获取当前经纬度
            type: 'wgs84', //返回可以用于wx.openLocation的经纬度，
            success: function (res) {
                wx.openLocation({ //​使用微信内置地图查看位置。
                    latitude: Number(lat), //要去的纬度-地址
                    longitude: Number(lon), //要去的经度-地址
                    name,
                    address
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})