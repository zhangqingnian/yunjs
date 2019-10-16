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
        isShare: false, //是否显示海报层(太阳码)
        isSelect: false, //是否显示选择框
        imgUrl: config.base_img_url,
        venue: {},
        venueFc: [],
        venueRating: [],
        venueKc: [],
        venueGk: [],
        venueKKC: {},
        ticketList:[],
        id:'',
        sportTypeId:'',
        sportName:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let { sportTypeId } = options ;
        let id = options.id || decodeURIComponent(options.scene);
        console.log(id);
        this.setData({
            id,
            sportTypeId: sportTypeId || ''
        })
        this._getVenueDetail(id, sportTypeId);
        this._getFc(id);
        this._getRating(id);
        this._getGk(id);
        this._getKc(id);
        this._getKKC(id);
        this._getTicket(id)
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

    onShareAppMessage(Object) {

    },
    onVenueMobile(){
        if (this.data.venue.venueMobile){
            wx.makePhoneCall({
                phoneNumber: this.data.venue.venueMobile
            })
        }
        
    },
    //门票详情
    onTicketDetail(e){
        let ticket = e.currentTarget.dataset.item;
        //ticket = JSON.stringify(ticket);
        wx.navigateTo({
            url: '/pages/venueTicket/venueTicketDetails/index?id=' + ticket.id,
        })
    },
    //课程详情
    onCourseDetail(e){
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/kechen/kechenDetails/index?id='+id,
        })
    },
    //馆卡详情
    onCardDetail(e){
        let { cardsTypeStr, id } = e.currentTarget.dataset.item;
        if (cardsTypeStr == '学期卡' || cardsTypeStr == '学期课') {
            wx.navigateTo({
                url: '/pages/venueCard/termCardDetails/index?id=' + id,
            })
        } else {
            wx.navigateTo({
                url: '/pages/venueCard/venueCardDetails/index?id=' + id,
            })
        }
    },
    //评论列表
    onRating(){
        wx.navigateTo({
            url: './rating/index?id='+this.data.id
        })
    },
    //场馆风采
    onFengcai(){
        wx.navigateTo({
            url: './fengcai/index?id=' + this.data.id
        })
    },
    //选择运动类型
    onSelectSportType(e){
        let { cvaSportTypeId, tvtTypeName } = e.currentTarget.dataset.item;
        this.setData({
            sportTypeId: cvaSportTypeId,
            sportName: tvtTypeName
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
        let venue = JSON.stringify(this.data.venue);
        if (!this.data.sportTypeId) {
            wx.showToast({
                title: '请先选择运动类型',
                icon: 'none'
            })
            return
        }

        venueModel.getFristTime({
            venueId:this.data.id,
            sportId: this.data.sportTypeId
        }).then(res => {
            if(res.data.success){
                let num = res.data.data;
                console.log(num)
                wx.navigateTo({
                    url: '/pages/yuding/index?id=' + this.data.id + '&sportTypeId=' + this.data.sportTypeId + '&venue=' + venue + '&sportName=' + this.data.sportName+'&num='+num,
                })
            }
            
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
    _getVenueDetail(id, sportTypeId) {
        wx.showLoading();
        venueModel.getVenueDetail(id).then(res => {
            wx.hideLoading();
            let sportName = '';
            res.data.data.venueAreaVo.forEach(item => {
                if (item.cvaSportTypeId == sportTypeId){
                    sportName = item.tvtTypeName;
                }
            })
            if (!sportTypeId){
                let cvaSportTypeId = res.data.data.venueAreaVo[0].cvaSportTypeId || "";
                let tvtTypeName = res.data.data.venueAreaVo[0].tvtTypeName || "";
                this.setData({ 
                    sportTypeId: cvaSportTypeId,
                    sportName: tvtTypeName,
                    venue: res.data.data
                })
            }else{
                this.setData({
                    venue: res.data.data,
                    sportName
                })
            }
            
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
    //评论
    _getRating(id) {
        venueModel.getRating({
            id,
            start:0,
            limit:3
        }).then(res => {
            this.setData({
                venueRating: res.data.items
            })
        })
    },
    //馆卡
    _getGk(id) {
        venueModel.getGk({
            venueId: id,
            start: 0,
            limit: 2
        }).then(res => {
            this.setData({
                venueGk: res.data.items,
                venueGkTotal: res.data.total
            })
        })
    },
    //课程
    _getKc(id) {
        venueModel.getKc({
            venueId: id,
            start: 0,
            limit:2
        }).then(res => {
            this.setData({
                venueKc: res.data.items,
                venueKcTotal:res.data.total
            })

        })
    },
    //门票
    _getTicket(id) {
        venueModel.getTicket({
            venueId: id,
            type: 1,
            start: 0,
            limit: 2
        }).then(res => {
            this.setData({
                ticketList: res.data.items
            })
        })
    }


})