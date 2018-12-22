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
}

