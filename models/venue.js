import {
    Http
} from '../utils/http.js';

export class VenueModel extends Http {
    //前三场馆
    getRanking(data) {
        return this.request({
            url: 'm/crm/venue/front/getRanking',
            method: 'POST',
            data
        })
    }

    //场馆列表
    getVenueList(data) {
        return this.request({
            url: 'm/crm/venue/front/selectAllVenueList',
            method: 'POST',
            data: data
        })
    }
    //场馆详情
    getVenueDetail(id) {
        return this.request({
            url: 'm/crm/venue/front/selectVenueDetailById?id=' + id
        })
    }
    //课卡场
    getKKC(id) {
        return this.request({
            url: 'm/crm/venue/front/selectCountCourseCardArea?id=' + id
        })
    }

    //场馆详情-风采
    getFcFront(data) {
        return this.request({
            url: 'm/crm/venue/front/selectVenueImgDetail',
            data
        })
    }

    //场馆详情-风采
    getFc(data) {
        return this.request({
            url: 'm/crm/venue/selectVenueImgDetail',
            data
        })
    }

    //场馆详情-用户评论
    getRating(data) {
        return this.request({
            url: 'm/crm/venue/front/selectVenueEvaluation',
            data
        })
    }

    //课程
    getKc(data) {
        return this.request({
            url: 'm/crm/venueCourse/front/getVeneuCourseByVenueId',
            data,
            method: 'POST'
        })
    }

    //课程详情
    getKcDetail(id) {
        return this.request({
            url: 'm/crm/venueCourse/front/venueCourseDetail?courseId=' + id,
        })
    }

    //课程详情 - 班级
    getClass(id) {
        return this.request({
            url: 'm/crm/venueClass/front/venueClassDetail?classId=' + id,
        })
    }

    //馆卡
    getGk(data) {
        return this.request({
            url: 'm/crm/venueCards/front/getVenueCardsByVenueId',
            data,
            method: 'POST'
        })
    }

    //馆卡/学期卡详情
    getCard(id){
        return this.request({
            url: 'm/crm/venueCards/front/VenueCardsDetail',
            data: {
                cardId: id
            }
        })
    }

    //门票列表 级 详情
    getTicket(data){
        return this.request({
            url: 'm/crm/entranceticketPublish/front/pageListVenueEntranceticket',
            data,
            method:'POST'
        })
    }
    //门票详情
    getTicketDetail(data){
        return this.request({
            url: 'm/crm/entranceticketPublish/front/getEntranceticketDetail',
            data,
            method: 'POST'
        })
    }
    //订场
    getField(id, sportTypeId, openDate){
        return this.request({
            url: 'm/crm/venueArea/front/selectVenueAreaByDate',
            data: {
                venueId: id,
                sportTypeId,
                openDate
            }
        })
    }

    //查询场地最早时间 返回 0 / 6 / 9
    getFristTime(data) {
        return this.request({
            url: 'm/crm/venueArea/front/getModelForSport',
            method: 'POST',
            data
        })
    }

    //馆卡列表(根据类型查馆卡列表)
    getVenueCardList(data){
        return this.request({
            url: 'm/crm/venueCards/front/listVenueCardsByTypes',
            method: 'POST',
            data
        })
    }

    //课程列表(查询所有能报名的课程)
    getVenueCourserList(data){
        return this.request({
            url: 'm/crm/venueCourse/front/listVenueCourseForStatus',
            method: 'POST',
            data
        })
    }

    //运动类型
    getVenuetype() {
        return this.request({
            url: 'm/crm/venue/front/selectAllVenueType'
        })
    }
    //分享朋友圈的太阳码  type 1馆卡 2课程 3门票 4场馆 goodId 
    sunCode(data){
        return this.request({
            url: 'm/wxaCode/front/getSubCode',
            method: 'POST',
            data
        })
    }
}