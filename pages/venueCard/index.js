// pages/venueCard/index.js
import {
    config
} from '../../config.js';
import {
    VenueModel
} from '../../models/venue.js';

let venueModel = new VenueModel();


Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: config.base_img_url,
        venueCard:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let id = options.id;
        this._getGk(id);
    },
    onShareAppMessage(Object) {

    },
    onGoDetail(e){
        let {cardtype, id}= e.currentTarget.dataset;
        console.log(id)
        if (cardtype == '学期卡' || cardtype == '学期课'){
            wx.navigateTo({
                url: './termCardDetails/index?id='+id,
            })
        }else{
            wx.navigateTo({
                url: './venueCardDetails/index?id=' + id,
            })
        }
    },
    _getGk(id) {
        venueModel.getGk(id,10).then(res => {
            console.log(res.data.items)
            this.setData({
                venueCard: res.data.items
            })
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