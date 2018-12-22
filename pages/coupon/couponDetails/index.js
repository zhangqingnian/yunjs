// pages/coupon/couponDetails/index.js
import {
    CouponModel
} from '../../../models/coupon.js';

let couponModel = new CouponModel();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        coupon:{},
        venue:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let coupon =JSON.parse(options.coupon);
        let venue = JSON.parse(options.venue);
        console.log(venue)
        console.log(coupon)
        this.setData({
            coupon,
            venue
        })
    },
    //查看地址 - 地图
    onMap(e) {
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
    //领取优惠券
    onReceiveCoupon(){
        let {venueId, couponNum} = this.data.coupon;
        couponModel.getReceiveCoupon({
            venueId,
            couponNum
        }).then(res => {
            console.log(res)
                wx.showToast({
                    title: res.data.msg,
                    icon:'none',
                    duration:1000
                })
            
        })
    }

})