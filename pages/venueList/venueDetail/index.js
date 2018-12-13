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
        console.log(id)
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
            console.log(res.data)
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
            console.log(res.data.items)
            this.setData({
                venueRating: res.data.items
            })
        })
    },
    //馆卡
    _getGk(id) {
        venueModel.getGk(id).then(res => {
            console.log(res.data.items)
            this.setData({
                venueGk: res.data.items
            })
        })
    },
    //课程
    _getKc(id) {
        venueModel.getKc(id).then(res => {
            console.log(res.data.items)
            this.setData({
                venueKc: res.data.items
            })

        })
    }


})