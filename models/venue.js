import {
    Http
} from '../utils/http.js';

export class VenueModel extends Http {
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
    getFc(id) {
        return this.request({
            url: 'm/crm/venue/front/selectVenueImgDetail',
            data: {
                id: id,
                start: 0,
                limit: 5
            }
        })
    }
    //场馆详情-用户评论
    getRating(id) {
        return this.request({
            url: 'm/crm/venue/front/selectVenueEvaluation',
            data: {
                id: id,
                start: 0,
                limit: 3
            }
        })
    }

    //课程
    getKc(id, limit = 2) {
        return this.request({
            url: 'm/crm/venueCourse/front/getVeneuCourseByVenueId',
            data: {
                venueId: id,
                start: 0,
                limit: limit
            },
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
    getGk(id, limit = 2) {
        return this.request({
            url: 'm/crm/venueCards/front/getVenueCardsByVenueId',
            data: {
                venueId: id,
                start: 0,
                limit: limit
            },
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
    getTicket(id){
        return this.request({
            url: 'm/crm/entranceticketPublish/front/pageListVenueEntranceticket',
            data: {
                venueId: id,
                type:1
            },
            method:'POST'
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
}