import {
    Http
} from '../utils/http.js';




export class MyModel extends Http {
    //添加学员/用户信息 33
    addStudentInfo(data) {
        return this.request({
            url: 'm/crm/student/saveStudent',
            method: 'POST',
            data
        })
    }

    //获取学员/用户信息 31
    getStudentInfo(data) {
        return this.request({
            url: 'm/crm/student/selectStudentForCustomer',
            method: 'POST',
            data
        })
    }
    //修改学员/用户信息 32
    reviseStudentInfo(data) {
        return this.request({
            url: 'm/crm/student/updateStudent',
            method: 'POST',
            data
        })
    }
    //删除学员/用户信息 35
    deleteStudentInfo(data) {
        return this.request({
            url: 'm/crm/student/removeStudent',
            method: 'POST',
            data
        })
    }
    
    //学员/用户详情
    getStudentDetail(data) {
        return this.request({
            url: 'm/crm/student/studentDetail',
            method: 'POST',
            data
        })
    }

    //常用联系人 （提交订单页面 选择联系人用）
    getContacts(data) {
        return this.request({
            url: 'm/crm/linkMan/selectLinkManList',
            data
        })
    }

    //添加联系人
    addContacts(data){
        return this.request({
            url: 'm/crm/myIndex/saveMyLinkMan',
            method: 'POST',
            data
        })
    }

    //我的联系人
    myContacts(data) {
        return this.request({
            url: 'm/crm/myIndex/myLinkManList',
            method: 'POST',
            data
        })
    }

    //删除联系人
    deleteContacts(data){
        return this.request({
            url: 'm/crm/myIndex/deletMyLinkMan',
            method: 'POST',
            data
        })
    }
    //修改联系人
    reviseContacts(data){
        return this.request({
            url: 'm/crm/myIndex/updateMyLinkMan',
            method: 'POST',
            data
        })
    }

    //设置默认联系人
    setDefulatContacts(data){
        return this.request({
            url: 'm/crm/myIndex/setMyLinkManDefault',
            method: 'POST',
            data
        })
    }

    //我的 index 用户信息 优惠券 余额 ...
    getMyInfo(data){
        return this.request({
            url: 'm/crm/myIndex/myIndexWallet',
            method: 'POST',
            data
        })
    }

    //我的  index 用户信息 头像 身高 ...
    getMyUserInfo(data){
        return this.request({
            url: 'm/crm/myIndex/getMySelfInfo',
            method: 'POST',
            data
        })
    }

    //意见反馈
    suggest(data){
        return this.request({
            url: 'm/crm/suggestion/CommitSuggestion',
            method: 'POST',
            data
        })
    }

    //积分记录
    getJifen(){
        return this.request({
            url: 'm/crm/pointsDetail/selectPointsDetailByUserId',
            method:'POST'
        })
    }

    //余额记录
    yueRecord(data){
        return this.request({
            url: 'm/crm/myIndex/myBalanceList',
            method: 'POST',
            data
        })
    }
}
