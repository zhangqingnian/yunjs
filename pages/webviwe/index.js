// pages/webviwe/index.js
import {
    config
} from '../../config.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: config.base_img_url,   //图片前缀
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let item = JSON.parse(options.item);
        console.log(item)
        this.setData({
            item
        })
    },
    onGoDetail(){
        //type: 商品类型: 1-馆卡，2-课程，3-门票
        let {type , goodsId} = this.data.item;
        if(type == 1){
            wx.navigateTo({
                url: '/pages/venueCard/venueCardDetails/index?id='+goodsId,
            })
        }else if(type == 2){
            wx.navigateTo({
                url: '/pages/kechen/kechenDetails/index?id='+goodsId,
            })
        }else if(type == 3){
            wx.navigateTo({
                url: '/pages/venueTicket/venueTicketDetails/index?id=' + goodsId,
            })
        }

    },
    onGoVenue(){
        let venueId = this.data.item.venueId;
        wx.navigateTo({
            url: '/pages/venueList/venueDetail/index?id=' + venueId,
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
        return {
            path: '/pages/webviwe/index?item=' + JSON.stringify(this.data.item)
        }
    }
})