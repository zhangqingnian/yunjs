import {
    Http
} from '../utils/http.js';




export class CourseModel extends Http {
    //我的 - 课程 1有效 2无效
    myCourseList(data){
        return this.request({
            url: 'm/crm/myCourse/listMyCourseByTypes',
            data
        })
    }

    //我的 - 课程 核销码
    myCode(data) {
        return this.request({
            url: 'm/crm/myCourseConsume/myCourseConsumesList',
            data
        })
    }

    //我的 - 课程 详情
    myCourseDetail(data) {
        return this.request({
            url: 'm/crm/venueClass/VenueCourseInMyClassDetail',
            data
        })
    }

    //使用记录 (核销记录)
    getRecord(data) {
        return this.request({
            url: 'm/crm/myCourseConsume/pageAllCourseHistoryForCustomerId',
            method: 'POST',
            data
        })
    }
}