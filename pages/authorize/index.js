// pages/authorize/index.js
import {
    config
} from '../../config.js';



const app = getApp();
Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onLoad: function() {
        var that = this;
        // 查看是否授权
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    that.login();
                } 
            }
        })
    },
    bindGetUserInfo: function(e) {
        wx.removeStorageSync('token')
        let { encryptedData , iv} = e.detail
        if (e.detail.userInfo) {
            //用户按了允许授权按钮
            this.login(encryptedData, iv);          
        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
                showCancel: false,
                confirmText: '返回授权'
            })
        }
    },
    login(){
        let that = this;
        wx.login({
            success(res) {
                //先wx.login()获取code 然后发送请求
                if (res.code) {
                    //发起网络请求
                    wx.getUserInfo({
                        success(respone) {
                            let { encryptedData, iv } = respone;
                            that._login(res.code, encryptedData, iv)
                        }
                    });
                    
                } 
            }
        })
    },
    //发起请求
    _login(code, encryptedData,iv){
        wx.showLoading({
            title: '登录中',
        })
        wx.request({
            url: config.api_base_url + 'front/miniproWeChatLogin',
            header:{
                'content-type': 'application/x-www-form-urlencoded'
            },  
            data: {
                code,
                encryptedData,
                iv
            },
            success: res => {
                let reslut = res.data;
                console.log(reslut);
                if (reslut.success) {
                    //存token
                    wx.setStorageSync('token', reslut.data)
                    /*
                    reslut.data
                        accessToken:'daDSAD555555'   //token
                        accessTokenExpire:0         
                        bindingMobile:false       //是否绑定手机
                        openid:"ot0gZ48fETpD83uurJxqRxzQfsGQ"
                        refreshTokenExpire:0
                        session_key:"94qSR5xboX7c9a7QYdnXOA=="   //微信token
                        unionid:0
                    */
                    //是否绑定手机
                    wx.setStorageSync('isBindMobile', reslut.data.bindingMobile);
                    if (!reslut.data.bindingMobile){
                        wx.navigateTo({
                            url: '/pages/bindMobile/index',
                        })
                        return
                    }
                    wx.navigateBack({
                        delta: 1,
                    })
                } else {
                    wx.showToast({
                        title: reslut.msg,
                        icon: 'none',
                        duration: 1000
                    })
                }

                //授权成功后，跳转进入小程序首页
                // wx.switchTab({
                //     url: '/pages/index/index'
                // })
            },
            fail: res => {
                console.log(res)
            },
            complete:res=> {
                wx.hideLoading();
            }
        })
    }
})