import {
    Http
} from '../utils/http.js';




export class MyOrderModel extends Http {
    //我的订单列表
    myOrderList(data) {
        return this.request({
            url: 'm/crm/myIndex/myVenueOrderList',
            method: 'POST',
            data
        })
    }
    //订单删除
    myOrderDel(data){
        return this.request({
            url: 'm/crm/myIndex/updateMyVenueOrder',
            method: 'POST',
            data
        })
    }

    shareOrderDel(data){
        return this.request({
            url: 'm/mini/venueGoodsOrder/removeVenueGoodsOrder',
            method: 'POST',
            data
        })
    }
    //门票 申请退款
    ticketOrderRefund(data){
        return this.request({
            url: 'm/pay/alipay/app/refund',
            method: 'POST',
            data
        })
    }

    //场地 评论
    orderRating(data){
        return this.request({
            url: 'm/crm/evaluation/saveEvaluationByObjectId',
            method: 'POST',
            data
        })
    }
}
