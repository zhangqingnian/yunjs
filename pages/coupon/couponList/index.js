// pages/coupon/index.js
/*
优惠券详情 153

*/
import {
    config
} from '../../../config.js';
import {
    CouponModel
} from '../../../models/coupon.js';

let couponModel = new CouponModel();


Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: config.base_img_url,
        couponList:[],
        venue:{},
        total:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let venue =JSON.parse(options.venue);
        let total = options.total;
        let { id, sportTypeId } = venue;
       
        this.setData({
            venue,
            total
        })

        
        this._getCouponList(id,sportTypeId)
    },
    //返回确认订单
    onGoback(e){
        let coupon =e.currentTarget.dataset.item;
        if(coupon.isUse){
            wx.setStorageSync('coupon', coupon);
            wx.navigateBack({
                delta:1
            })
        }
        console.log(coupon)
        // wx.navigateTo({
        //     url: './couponDetails/index?coupon=' + coupon + '&venue=' + venue,
        // })
    },
    
    _getCouponList(id, sportTypeId){
        couponModel.getMyCoupon({
            type:3,
            sportId: sportTypeId,
            id
        }).then(res => {
            let reslut = res.data.data;
            this._dataHandle(reslut);
        })
    },
    //数据过滤  isUse 是否可用
    _dataHandle(reslut){
        reslut.forEach(item => {
            //满减
            if (item.couponType == 0) {
                if (this.data.total >= item.consume) {
                    item.isUse = true
                } else {
                    item.isUse = false
                }
            }
            //直接抵扣
            if (item.couponType == 1) {
                item.isUse = true
            }
        })

        this.setData({
            couponList: reslut
        })
        console.log(reslut)
    }

})