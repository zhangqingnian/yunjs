// pages/coupon/index.js
/*
优惠券详情 153

*/
import {
    config
} from '../../config.js';
import {
    CouponModel
} from '../../models/coupon.js';

let couponModel = new CouponModel();


Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: config.base_img_url,
        couponList:[],
        venue:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let venue =JSON.parse(options.venue);
        console.log(venue)
        let id = venue.venueId || venue.id
        this.setData({
            venue
        })
        this._getCouponList(id)
    },
    //去优惠券详情页
    onGodetails(e){
        let coupon =JSON.stringify(e.currentTarget.dataset.item);
        let venue = JSON.stringify(this.data.venue)
        wx.navigateTo({
            url: './couponDetails/index?coupon=' + coupon + '&venue=' + venue,
        })
    },
    //领取优惠券
    onReceiveCoupon(e) {
        let token = wx.getStorageSync('token').accessToken;
        if (!token){
            wx.navigateTo({
                url: '/pages/authorize/index'
            })
            return
        }

        let isBindMobile = wx.getStorageSync('isBindMobile');
        if (!isBindMobile) {
            wx.navigateTo({
                url: '/pages/bindMobile/index'
            })
            return
        }
        let { venueId, couponNum } = e.currentTarget.dataset.item;
        couponModel.getReceiveCoupon({
            venueId,
            couponNum
        }).then(res => {
            console.log(res)
            wx.showToast({
                title: res.data.msg,
                duration: 1000
            })
            
        })
    },
    _getCouponList(venueId){
        couponModel.getCouponList({
            venueId,
            status:0,
            selectType:0
        }).then(res => {
            console.log(res.data.items)
            this.setData({
                couponList: res.data.items
            })
        })
    }

})