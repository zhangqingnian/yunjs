import {
    Http
} from '../utils/http.js';




export class AreaModel extends Http {
    //我的 - 场地 1有效 2无效
    myAreaList(data) {
        return this.request({
            url: 'm/crm/venueOrder/getVenueOderInMyArea',
            method: 'POST',
            data
        })
    }

   
    //我的 - 场地（订单） 详情
    myAreaDetail(data) {
        return this.request({
            url: 'm/crm/myIndex/myVenueOrderDetail',
            method: 'POST',
            data
        })
    }

}