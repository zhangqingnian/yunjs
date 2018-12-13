// pages/authorize/index.js
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
            success: function(res) {
                if (res.authSetting['scope.userInfo']) {
                
                    wx.getUserInfo({
                        success: function(res) {
                            let { encryptedData, iv } = res
                            that.login(encryptedData, iv);
                            //从数据库获取用户信息
                            //that.queryUsreInfo();
                            //用户已经授权过
                            // wx.switchTab({
                            //     url: '/pages/index/index'
                            // })
                        }
                    });
                }
            }
        })
    },
    bindGetUserInfo: function(e) {
        let { encryptedData , iv} = e.detail
        if (e.detail.userInfo) {
            //用户按了允许授权按钮
            this.login(encryptedData, iv);
            
            //授权成功后，跳转进入小程序首页
            // wx.switchTab({
            //     url: '/pages/index/index'
            // })
        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
                showCancel: false,
                confirmText: '返回授权',
                success: function(res) {
                    if (res.confirm) {
                        console.log('用户点击了“返回授权”')
                    }
                }
            })
        }
    },
    //获取用户信息接口
    // queryUsreInfo: function() {
    //     // wx.request({
    //     //     url: app.globalData.urlPath + 'user/userInfo',
    //     //     data: {
    //     //         openid: app.globalData.openid
    //     //     },
    //     //     header: {
    //     //         'content-type': 'application/json'
    //     //     },
    //     //     success: function(res) {
    //     //         console.log(res.data);
    //     //         getApp().globalData.userInfo = res.data;
    //     //     }
    //     // })
    // },
    login(encryptedData, iv){
        console.log(encryptedData)
        console.log(iv)
        wx.login({
            success(res) {
                //先wx.login()获取code 然后发送请求
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: 'http://192.168.1.156:9999/yunjs-web/front/miniproWeChatLogin',
                        data: {
                            code: res.code,
                            encryptedData,
                            iv
                        },
                        success:res => {
                            console.log(res)
                        },
                        fail:res => {
                            console.log(res)
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    }

})