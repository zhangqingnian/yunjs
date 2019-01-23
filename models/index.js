import {
    Http
} from '../utils/http.js';

export class IndexModel extends Http {
    
    //获取轮播图
    getBanner(){
        return this.request({
            url:'m/mini/activity/front/pageActivity?activityType=1&programType=1'
        })
    }
    //本月活动
    getBenyue(){
        return this.request({
            url: 'm/mini/activity/front/pageActivity?activityType=2&programType=1'
        })
    }




    //推荐场馆
    getTuijian(city){
        return this.request({
            url: 'm/crm/venue/front/selectPageRecommendation?city='+city
        })
    }

    //运动类型
    getVenuetype(){
        return this.request({
            url:'m/crm/venue/front/selectAllVenueType'
        })
    }

    //热门课程
    getHot(){
        return this.request({
            url: 'm/mini/hotType/front/pageHotType',
            data:{
                start:0,
                limit:4
            }
        })
    }
}

/*
m/sys/refinedActivity/front/selectRefinedActivityList
type
1-精选活动   2-bannner   3-弹出广告
*/