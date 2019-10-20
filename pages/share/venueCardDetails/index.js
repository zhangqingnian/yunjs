// pages/venueCard/venueCardDetails/index.js
import {
    config
} from '../../../config.js';
import {
    CardModel
} from '../../../models/card.js';
import {
    VenueModel 
} from '../../../models/venue.js';
let cardModel = new CardModel();
let venueModel = new VenueModel();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShare: false, //是否显示海报层
        isSelect: false, //是否显示选择框
        imgUrl: config.base_img_url,
        card: {},
        time: [{
            name: '立即',
            value: 0,
            isOn: true
        }, {
            name: '1天',
            value: 1,
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
        currentTime: 0,
        extend: '',
        showCoupon: true, //优惠券显示
        venueFc:[],
        isShareType:false //是否从分享进 
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //id 排序   venueGoodsId 商品   packageId 任务 customerId 分析 nickName 昵称 type 主管/分销员
        let {
            id,
            venueGoodsId,
            packageId,
            customerId,
            nickName,
            type,
            isShareType
        } = options;
        var share = {};
        if (isShareType) {
            this.setData({
                isShareType: true
            })
        }
        if(venueGoodsId){
            share = options;
        }
       
        if (!venueGoodsId){
            /*id 排序
                venueGoodsId 商品
                packageId 任务
                customerId 分析
                type 主管/分销员
                nickName 昵称 （不支持中文 没传）*/
            let arr = decodeURIComponent(options.scene).split('_');
            id = arr[0];
            venueGoodsId = arr[1];
            packageId = arr[2];
            customerId= arr[3];
            type = arr[4];
            nickName = '';
            share = {
                id,
                venueGoodsId,
                packageId,
                customerId,
                type,
                nickName
            }
            this.setData({
                isShareType:true   //是否是从分享的海报进入
            })
        }
        //extend 从分销端跳转带过来的标识详情页分享(推广)标识；
        let extend = options.extend || '';
        this.setData({
            id,
            venueGoodsId,
            packageId,
            customerId,
            nickName,
            type,
            extend,
            share
        })
    },
    onShow(){
        let {
            id,
            venueGoodsId,
            packageId,
            customerId,
            type
        } = this.data;
        this._getCardDetail({
            id,
            venueGoodsId,
            packageId,
            customerId,
            type
        });
    },
    //场馆风采
    onFengcai() {
        wx.navigateTo({
            url: '/pages/venueList/venueDetail/fengcai/index?id=' + this.data.card.venueId
        })
    },
    //生成图片层
    onShare() {
        this.setData({
            isShare: true,
            isSelect: false
        })
    },
    //关闭图片层
    onCloseShare() {
        this.setData({
            isShare: false
        })
    },

    //显示选择框
    onSelect() {
        this.setData({
            isSelect: true
        })
    },
    //关闭选择框
    onCancelSelect() {
        this.setData({
            isSelect: false
        })
    },
    //使用优惠券
    onUserCoupon(e) {
        let coupon = e.currentTarget.dataset.coupon;
        let salePrice = this.data.card.salePrice;
        let money = salePrice - coupon;
        wx.showLoading()
        cardModel.getMark({
            couponMoney:coupon
        }).then(res => {
            wx.hideLoading()
            let {data, msg, success} = res.data;
            if(success){
                wx.showModal({
                    title: '提示',
                    content: data,
                    showCancel: false,
                    success:res => {
                        this.setData({
                            showCoupon: false,
                            money
                        })
                    }
                })
            }else{
                wx.showToast({
                    title: msg,
                    icon: 'none',
                })
            }
        })
       
    },
    //进入场馆
    onGoVenue() {
        let {
            id,
            venueGoodsId,
            packageId,
            customerId,
            nickName
        } = this.data;
        wx.navigateTo({
            url: '/pages/share/shop/index?nickName=' + nickName + '&customerId=' + customerId,
        })
    },
    //跳转提交订单页
    onGoOrder(e) {
        let card = this.data.card;
        card.cardName = card.cardName.replace(/\&/g, "%26");
        card.remark ='';
        let sortId = this.data.id
        let { venueGoodsId, packageId, customerId, type, money, currentTime} = this.data;
        //id,venueGoodsId,packageId,customerId,type
        wx.navigateTo({
            url: '/pages/share/confirmOrder/card/index?card=' + JSON.stringify(card) + '&currentTime=' + currentTime + '&sortId=' + sortId + '&money=' + money + '&venueGoodsId=' + venueGoodsId + '&packageId=' + packageId + '&customerId=' + customerId + '&type=' + type ,
        })
    },
    onSelectTime(e) {
        let {
            isOn,
            name
        } = e.currentTarget.dataset.item;
        var currentTime = '';
        if (!isOn) {
            let times = this.data.time;
            times.forEach(item => {
                if (item.name == name) {
                    item.isOn = true;
                    currentTime = item.value;
                } else {
                    item.isOn = false
                }
            })
            this.setData({
                time: times,
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
    onShareAppMessage(options) {
        let {
            id,
            venueGoodsId,
            packageId,
            customerId,
            nickName,
            type
        } = this.data;
        return {
            title: this.data.card.cardName,
            imageUrl: this.data.imgUrl + this.data.card.fileName,
            path: '/pages/share/venueCardDetails/index?id=' + id + '&venueGoodsId=' + venueGoodsId + '&packageId=' + packageId + '&customerId=' + customerId + '&type=' + type + '&nickName=' + nickName + '&isShareType=yes'
        }
    },
    //风采
    _getFc(id) {
        venueModel.getFcFront({
            id: id,
            start: 0,
            limit: 5
        }).then(res => {
            this.setData({
                venueFc: res.data.items
            })
        })
    },

    _getCardDetail({
        id,
        venueGoodsId,
        packageId,
        customerId,
        type
    }) {
        cardModel.getCardsDetail({
            venueGoodsId,
            id,
            packageId,
            customerId,
            type
        }).then(res => {
            if(res.data.success){
                this._getFc(res.data.data.venueId)
                this.setData({
                    card: res.data.data,
                    money: res.data.data.salePrice
                })
                console.log(this.data)
            }else{
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                })
            }
            

        })
    },
    
})