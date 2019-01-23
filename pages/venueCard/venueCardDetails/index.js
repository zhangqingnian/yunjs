// pages/venueCard/venueCardDetails/index.js
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
        card: {},
        time: [{
            name: '立即',
            value:0,
            isOn: true
        }, {
            name: '1天',
            value:1,
            isOn: false
        }, {
            name: '3天',
                value: 3,
            isOn: false
        }, {
            name: '7天',
                value: 7,
            isOn: false
        }],
        currentTime:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let id = options.id;
        this._getCard(id);
    },
    onShareAppMessage(Object) {

    },
    //进入场馆
    onGoVenue(){
        wx.navigateTo({
            url: '/pages/venueList/venueDetail/index?id=' + this.data.card.venueId,
        })
    },
    //跳转提交订单页
    onGoOrder(e){
        let card = JSON.stringify(this.data.card);
        let currentTime = this.data.currentTime;
        console.log(currentTime)
        wx.navigateTo({
            url: '/pages/confirmOrder/card/index?card=' + card + '&currentTime=' + currentTime,
        })
    },
    onSelectTime(e){
        let {isOn, name} = e.currentTarget.dataset.item;
        var currentTime = '';
        if(!isOn){
            let times = this.data.time;
            times.forEach(item => {
                if(item.name == name){
                    item.isOn = true;
                    currentTime = item.value;
                }else{
                    item.isOn = false
                }
            })
            this.setData({
                time:times,
                currentTime: currentTime
            })
        }
    },
    onMap(e) {
        let {
            name,
            address,
            lat,
            lon
        } = e.currentTarget.dataset;
        wx.getLocation({ //获取当前经纬度
            type: 'wgs84', //返回可以用于wx.openLocation的经纬度，
            success: function(res) {
                wx.openLocation({ //​使用微信内置地图查看位置。
                    latitude: Number(lat), //要去的纬度-地址
                    longitude: Number(lon), //要去的经度-地址
                    name,
                    address
                })
            }
        })
    },
    _getCard(id) {
        venueModel.getCard(id).then(res => {
            console.log(res.data.data)
            this.setData({
                card: res.data.data
            })

        })
    }
})