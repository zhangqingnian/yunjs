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
        isShare:false,     //是否显示海报层
        isSelect:false,    //是否显示选择框
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
        var id = options.id || decodeURIComponent(options.scene).split('_')[0];
        this.setData({
            id
        })
        this._getCard(id);
    },
    onShareAppMessage(Object) {
        return {
            title: this.data.card.cardName
        }
    },
    //查看协议
    onElectronicProtocol(e) {
        let src = e.currentTarget.dataset.img;
        let imgSrc = config.base_img_url + src;
        wx.navigateTo({
            url: '/pages/electronicProtocol/index?imgSrc=' + imgSrc
        })
    },
    //生成图片层
    onShare(){
        this.setData({
            isShare:true,
            isSelect:false
        })
    },
    //关闭图片层
    onCloseShare() {
        this.setData({
            isShare: false
        })
    },

    //显示选择框
    onSelect(){
        this.setData({
            isSelect: true
        })
    },
    //关闭选择框
    onCancelSelect(){
        this.setData({
            isSelect:false
        })
    },
    
    //进入场馆
    onGoVenue(){
        wx.navigateTo({
            url: '/pages/venueList/venueDetail/index?id=' + this.data.card.venueId,
        })
    },
    //跳转提交订单页
    onGoOrder(e){
        // 对于“&”的处理
        let card = this.data.card;
        card.cardName = card.cardName.replace(/\&/g, "%26");
        card.remark = ''
         card = JSON.stringify(card)
        let currentTime = this.data.currentTime;
        wx.navigateTo({
            url: '/pages/confirmOrder/card/index?card=' + card + '&currentTime=' + currentTime 
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