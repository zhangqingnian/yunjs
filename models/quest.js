import {
    Http
} from '../utils/http.js';




export class QuestModel extends Http{
    //绑定手机号码
    bindMobilePhone(data){
        return this.request({
            url: 'm/weChatLogin/bindingsMobile',
            method: 'POST',
            data
        })
    }

    //省 市 区
    //省
    getProvince(){
        return this.request({
            url: 'm/sys/city/front/selectAllProvince'
        })
    }
    //市 区 传上一级的nodeCode
    getCity(data) {
        return this.request({
            url: 'm/sys/city/front/selectCityByParentId',
            data
        })
    }

    //我的  index 用户信息 头像 身高 ...
    getMyUserInfo(data) {
        return this.request({
            url: 'm/crm/myIndex/getMySelfInfo',
            method: 'POST',
            data
        })
    }

    //修改个人资料
    updateUserInfo(data) {
        return this.request({
            url: 'm/crm/myIndex/updateMySelfInfo',
            method: 'POST',
            data
        })
    }

    //修改支付密码
    revisePayPassword(data){
        return this.request({
            url: 'm/crm/customer/setOrUpdatePayCode',
            method: 'POST',
            data
        })
    }

    //获取验证码
    getCode(data){
        return this.request({
            url: 'front/register/validateLoginNameCode',
            data
        })
    }
}

