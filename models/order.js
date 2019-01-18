import {
    Http
} from '../utils/http.js';




export class OrderModel extends Http {
    /* 门票 */ 
    //提交门票订单
    submitTicketOrder(data) {
        return this.request({
            url: 'm/crm/venueOrder/saveVenueEntranceticketOrderInfo',
            method: 'POST',
            data
        })
    }

    //取消门票订单
    cancelTicketOrder(data) {
        return this.request({
            url: 'm/crm/venueOrder/front/updateEntranceTicketPayStatus',
            method: 'POST',
            data
        })
    }

    //微信支付
    wxPayTicket(data) {
        return this.request({
            url: 'm/pay/wechat/app/WechatPaymentParams',
            method: 'POST',
            data
        })
    }


    //门票 - 余额支付
    yePayTicket(data) {
        return this.request({
            url: 'm/crm/venueOrder/updateEntranceTicketPay',
            method: 'POST',
            data
        })
    }

    /* 馆卡 */ 
    //提交馆卡订单
    submitCardOrder(data) {
        return this.request({
            url: 'm/crm/venueOrder/saveVenueCardOrderInfo',
            method: 'POST',
            data
        })
    }

    //馆卡 - 余额支付 50
    yePayCard(data) {
        return this.request({
            url: 'm/crm/myCards/updateVenueCardsPayment',
            method: 'POST',
            data
        })
    }


    /*课程*/ 
    //提交课程订单 
    submitCourseOrder(data) {
        return this.request({
            url: 'm/crm/venueOrder/saveVenueCourseOrderInfo',
            method: 'POST',
            data
        })
    }

    //课程余额支付
    yePayCourse(data){
        return this.request({
            url:'m/crm/myCourse/updateVenueCoursePayment',
            method:'POST',
            data
        })
    }

    /*场地*/ 
    //提交场地订单 
    submitAreaOrder(data) {
        return this.request({
            url: 'm/crm/venueOrder/saveVenueOrderInfo',
            method: 'POST',
            data
        })
    }

    //场地余额支付
    yePayArea(data) {
        return this.request({
            url: 'm/crm/rechargeAccount/updateVenueOrderPayment',
            method: 'POST',
            data
        })
    }
}
