//app.js
const mtjwxsdk = require("./utils/mtj-wx-sdk.js");
import {config} from './config.js'

App({
    onShow(options){
    },
    globalData: {
        userInfo: null,
        hotCourse:null,
        tuijian:null,
        bindingMobile:null,
        province: null,
        city: null,       //城市
        customerId:null
    }
})