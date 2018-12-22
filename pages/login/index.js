// pages/login/index.js

import { config } from '../../config.js'


import {
    QuestModel
} from '../../models/quest.js';

let questModel = new QuestModel();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        iphone: '',
        code:'',
        isOn:false,
        msg:'获取验证码',
        currentTime:60
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    onCodeInput(e) {
        let code = e.detail.value.trim();
        this.setData({
            code
        })
    },
    onIphoneInput(e) {
        let iphone = e.detail.value.trim();
        if (iphone.length >= 11){
            this.setData({
                isOn:true,
                iphone
            })
        }else{
            this.setData({
                isOn: false,
                iphone
            })
        }
        
    },
    onGetCode(){
        let { isOn, iphone, currentTime, msg} = this.data;
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if(!isOn)return;

        if (myreg.test(iphone)){
            this.setData({
                msg: currentTime + 's',
                isOn: false
            })
            
            this._getCode(iphone)
            
            let interval = setInterval(() => {
                this.setData({
                    msg: (currentTime - 1) + 's',
                })
                currentTime--;
                if (currentTime <= 0) {
                    clearInterval(interval)
                    this.setData({
                        msg,
                        currentTime: 60,
                        isOn: true
                    })
                }
            }, 1000)
           
        }else{
            wx.showModal({
                title: '提示',
                content: '手机号码输入不正确，请重新输入',
                showCancel: false,
                confirmText: '确定'
            })
        }
    },
    
    onLogin(){
        let {iphone ,code} = this.data;
        let { accessToken} = wx.getStorageSync('token');
        if(!iphone || !code){
            wx.showModal({
                title: '提示',
                content: '请输入正确的手机号和短信验证码',
                showCancel: false,
                confirmText: '确定'
            })
            return
        }
        questModel.bindMobilePhone({
                mobile: iphone,
                mobileCode: code,
                pwd: 'swojdposw'
        }).then(res => {
            console.log(res);
            if (res.data.success) {
                wx.switchTab({
                    url: '/pages/index/index'
                })
            } else {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 1000
                })
            }
        })
        /*
        wx.request({
            url: config.api_base_url +'m/weChatLogin/bindingsMobile',
            method:'POST',
            header:{
                'content-type': 'application/x-www-form-urlencoded',
                'ACCESS_TOKEN': accessToken
            },
            data:{
                mobile: iphone,
                mobileCode:code,
                pwd:'swojdposw'
            },
            success(res){
                console.log(res);
                if(res.data.success){
                    wx.switchTab({
                        url: '/pages/index/index'
                    })
                }else{
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none',
                        duration:1000
                    })
                }
            }
        })
        */

    },
    _getCode(iphone){
        wx.request({
            url: config.api_base_url +'m/sendMsg/front/sendMsgForWechatMobile',
            data:{
                mobile:iphone
            },
            success(res){
                if(res.data.success){
                    wx.showToast({
                        title: res.data.msg
                    })
                }
            }
        })
    }
})