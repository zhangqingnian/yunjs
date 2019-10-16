import {
    Http
} from '../utils/http.js';




export class TicketModel extends Http {
    //获取 我的门票
    getMyTicket(data) {
        return this.request({
            url: 'm/crm/venueOrder/getVenueOderInMyTicket',
            method: 'POST',
            data
        })
    }

    //使用
    useMyTicket(data){
        return this.request({
            url: 'm/crm/venueOrder/front/getVerificationCode',
            data
        })
    }

    //门票核销时间
    myTickeTime(data) {
        return this.request({
            url: 'm/crm/entranceticketPublish/getEntranceticketByPublishId',
            method: 'POST',
            data
        })
    }
}    