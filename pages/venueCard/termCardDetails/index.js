// pages/venueCard/termCardDetails/index.js
import {
    config
} from '../../../config.js';
import {
    VenueModel
} from '../../../models/venue.js';

let venueModel = new VenueModel();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: config.base_img_url,
        card:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let id = options.id;
        this._getCard(id);
    },
    //进入场馆
    onGoVenue() {
        wx.navigateTo({
            url: '/pages/venueList/venueDetail/index?id=' + this.data.card.venueId,
        })
    },
    onShareAppMessage(Object) {

    },
    onGoOrder(e){
        let card = JSON.stringify(this.data.card);
        wx.navigateTo({
            url: '/pages/confirmOrder/termcard/index?card=' + card
        })
    },
    onMap(e){
        console.log(e.currentTarget.dataset);
        let { name, address, lat, lon } = e.currentTarget.dataset;
        wx.getLocation({//获取当前经纬度
            type: 'wgs84', //返回可以用于wx.openLocation的经纬度，
            success: function (res) {
                wx.openLocation({//​使用微信内置地图查看位置。
                    latitude: Number(lat),//要去的纬度-地址
                    longitude: Number(lon),//要去的经度-地址
                    name,
                    address
                })
            }
        })
    },
    _getCard(id){
        venueModel.getCard(id).then(res => {
            console.log(res.data.data)
            this.setData({
                card: res.data.data
            })
            
        })
    }
})