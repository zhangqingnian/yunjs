// pages/venuedetail/index.js

import {
    config
} from '../../../config.js';
import {
    VenueModel
} from '../../../models/venue.js';

let venueModel = new VenueModel();




Page({
    
    /**
     * 页面的初始数据    经纬度 lat lon
     */
    data: {
        imgUrl: config.base_img_url,
        venue: {},
        venueFc: [],
        venueRating: [],
        venueKc: [],
        venueGk: [],
        venueKKC: {},
        id:'',
        sportTypeId:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options)
        let { id, sportTypeId } = options;
        this.setData({
            id,
            sportTypeId
        })
        this._getVenueDetail(id);
        this._getFc(id);
        this._getRating(id);
        this._getGk(id);
        this._getKc(id);
        this._getKKC(id);
    },
    //选择运动类型
    onSelectSportType(e){
        let sportTypeId = e.currentTarget.dataset.cvasporttypeid;
        this.setData({
            sportTypeId
        })
    },
    //购买课程
    onBuyCourse(e) {
        wx.navigateTo({
            url: '/pages/venueCourser/index?id='+this.data.id,
        })
    },
    //购买馆卡
    onBuyVenueCard(e) {
        wx.navigateTo({
            url: '/pages/venueCard/index?id=' + this.data.id,
        })
    },
    //场馆门票
    onBuyVenueTicket(e) {
        wx.navigateTo({
            url: '/pages/venueTicket/index?id=' + this.data.id,
        })
    },
    //场地预约
    onBuyfield(e) {
        wx.navigateTo({
            url: '/pages/yuding/index?id=' + this.data.id + '&sportTypeId=' + this.data.sportTypeId,
        })
    },
    //跳转优惠券列表
    onGoCoupon(){
        let venue = JSON.stringify(this.data.venue)
        wx.navigateTo({
            url: '/pages/coupon/index?venue=' + venue
        })
    },
    //查看地址 - 地图
    onMap(e){
        console.log(e.currentTarget.dataset);
        let { name, address, lat, lon } = e.currentTarget.dataset;
        wx.getLocation({//获取当前经纬度
            type: 'wgs84', //返回可以用于wx.openLocation的经纬度，
            success: function (res) {
                wx.openLocation({//​使用微信内置地图查看位置。
                    latitude:Number(lat),//要去的纬度-地址
                    longitude:Number(lon),//要去的经度-地址
                    name ,
                    address
                })
            }
        })
    },
    //详情
    _getVenueDetail(id) {
        venueModel.getVenueDetail(id).then(res => {
            console.log(res.data.data)
            this.setData({
                venue: res.data.data
            })
        })
    },
    //课卡场
    _getKKC(id) {
        venueModel.getKKC(id).then(res => {
            this.setData({
                venueKKC: res.data
            })
        })
    },

    //风采
    _getFc(id) {
        venueModel.getFc(id).then(res => {
            this.setData({
                venueFc: res.data.items
            })
        })
    },
    //评论
    _getRating(id) {
        venueModel.getRating(id).then(res => {
            this.setData({
                venueRating: res.data.items
            })
        })
    },
    //馆卡
    _getGk(id) {
        venueModel.getGk(id).then(res => {
            this.setData({
                venueGk: res.data.items
            })
        })
    },
    //课程
    _getKc(id) {
        venueModel.getKc(id).then(res => {
            this.setData({
                venueKc: res.data.items
            })

        })
    }


})