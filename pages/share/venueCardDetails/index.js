// pages/venueCard/venueCardDetails/index.js
import {
    config
} from '../../../config.js';
import {
    CardModel
} from '../../../models/card.js';

let cardModel = new CardModel();
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
        currentTime:0,
        extend:'',
        showCoupon:true  //优惠券显示
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) { 
        //id 排序   venueGoodsId 商品   packageId 任务 customerId 分析 nickName 昵称
        console.log(options)
        let { id, venueGoodsId, packageId, customerId, nickName, type } = options;
        //extend 详情页分享(推广)标识；
        let extend = options.extend || '';

        this.setData({
            id, venueGoodsId, packageId, customerId, nickName, type, extend
        })
        this._getCardDetail({id, venueGoodsId, packageId, customerId,type });
    },
    //使用优惠券
    onUserCoupon(e){
        let coupon = e.currentTarget.dataset.coupon;
        let salePrice = this.data.card.salePrice;
        let money = salePrice - coupon;
        this.setData({
            showCoupon:false,
            money
        })
    },
    //进入场馆
    onGoVenue(){
        let { id, venueGoodsId, packageId, customerId, nickName } = this.data;
        wx.navigateTo({
            url: '/pages/share/shop/index?nickName=' + nickName + '&customerId=' + customerId,
        })
    },
    //跳转提交订单页
    onGoOrder(e){
        let card = JSON.stringify(this.data.card);
        let currentTime = this.data.currentTime;
        let sortId = this.data.id
        let money = this.data.money;
        console.log(currentTime)
        wx.navigateTo({
            url: '/pages/share/confirmOrder/card/index?card=' + card + '&currentTime=' + currentTime + '&sortId=' + sortId + '&money=' + money,
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
    onShareAppMessage(options){
        let { id, venueGoodsId, packageId, customerId, nickName, type} = this.data;
        return {
            path: '/pages/share/venueCardDetails/index?id=' + id + '&venueGoodsId=' + venueGoodsId + '&packageId=' + packageId + '&customerId=' + customerId + '&type=' + type + '&nickName=' + nickName
        }
    },
    _getCardDetail({id, venueGoodsId,packageId,customerId,type}) {
        cardModel.getCardsDetail({
            venueGoodsId,
            id,
            packageId,
            customerId,
            type
        }).then(res => {
            console.log(res.data.data)
            this.setData({
                card: res.data.data,
                money: res.data.data.salePrice
            })

        })
    }
})