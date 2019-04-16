import {
    Http
} from '../utils/http.js';




export class CardModel extends Http {
    //我的 - 馆卡 1有效 2无效
    myCardList(data) {
        return this.request({
            url: 'm/crm/venueCards/getVenueCardValidOrInValid',
            method:'POST',
            data
        })
    }

    //我的 - 馆卡 核销码
    myCode(data) {
        return this.request({
            url: 'm/crm/myCourseConsume/myCourseConsumesList',
            data
        })
    }

    //我的 - 馆卡 详情
    myCardDetail(data) {
        return this.request({
            url: 'm/crm/venueClass/VenueCourseInMyClassDetail',
            data
        })
    }

    //会员卡 使用
    myVipCard(data){
        return this.request({
            url: 'm/crm/myCards/getVenueCardCodeAndTimesForCustomer',
            method: 'POST',
            data
        }) 
    }

    //会员卡 支付
    myVipCardPay(data) {
        return this.request({
            url: 'm/crm/myCards/updateMyCardBalance',
            method: 'POST',
            data
        })
    }


    //使用记录 (核销记录)
    getRecord(data){
        return this.request({
            url: 'm/crm/myCardsConsume/pageAllCardsHistoryForCustomerId',
            method: 'POST',
            data
        })
    }


    //名片
    getCard(data) {
        return this.request({
            url: 'm/mini/saleUser/front/getSaleUser',
            data,
            method: 'POST'
        })
    }

    //推荐商品列表
    recommendList(data) {
        return this.request({
            url: 'm/mini/goodsSort/front/getAllGoodsForSale',
            data,
            method: 'POST'
        })
    }

    //馆卡详情
    getCardsDetail(data, entry) {
        return this.request({
            url: 'm/mini/venueGoods/front/getCardsDetail',
            data,
            method: 'POST'
        })
    }
    //课程详情
    getCourseDetail(data, entry) {
        return this.request({
            url: 'm/mini/venueGoods/front/getCourseDetail',
            data,
            method: 'POST'
        })
    }

    //提交订单(分享 馆卡+课程)
    submitShareOrder(data){
        return this.request({
            url: 'm/mini/venueGoodsOrder/saveVenueGoodsOrderForMini',
            data,
            method: 'POST'
        })
    }
}