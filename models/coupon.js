import {
    Http
} from '../utils/http.js';




export class CouponModel extends Http {
    //获取所有优惠券及数量
    getCouponList(data) {
        return this.request({
            url: 'm/crm/orienteeringCoupons/front/pageListOrienteeringCoupons',
            method: 'POST',
            data
        })
    }


    //领取优惠券
    getReceiveCoupon(data){
        return this.request({
            url: 'm/crm/orienteeringCoupons/updateMyCouponForCommonCoupon',
            method: 'POST',
            data
        })
    }

    //获取购买时我的指定某类优惠券列表 1：场地 2：课程 3：门票  4：馆卡
    getMyCoupon(data){
        return this.request({
            url: 'm/crm/myCoupon/getMyOrienteeringCoupons',
            method: 'POST',
            data
        })
    }

    //我的 -> 优惠券 1:未使用 2：已使用 3：已过期
    getMyCouponList(data){
        return this.request({
            url: 'm/crm/orienteeringCoupons/pageListMyCoupon',
            method: 'POST',
            data
        })
    }
    
    //兑换优惠券
    exchangeCoupon(data){
        return this.request({
            url: 'm/crm/orienteeringCoupons/updateMyCouponForOrienteeringCoupons',
            method: 'POST',
            data
        })
    }

    //领取更多优惠券
    getCoupon(data) {
        return this.request({
            url: 'm/crm/orienteeringCoupons/front/getAllCouponList',
            method: 'POST',
            data
        })
    }
}
