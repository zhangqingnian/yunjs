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
        let start = this.data.venueCard.length;
        this.setData({
            id
        })
        this._getGk(id,start);
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
    _getGk(id,start) {
        wx.showLoading()
        venueModel.getGk({
                venueId: id,
                start,
                limit: 10
            }).then(res => {
                wx.hideLoading()
            console.log(res.data.items)
            let temArr = res.data.items.concat(this.data.venueCard)
            this.setData({
                venueCard: temArr,
                total:res.data.total
            })
        })
    },
    
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        let start = this.data.venueCard.length;
        let total = this.data.total;
        let id = this.data.id;
        if(start >= total)return;
        this._getGk(id,start)
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})