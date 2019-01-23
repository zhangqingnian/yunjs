// pages/bindMobile/index.js
import { config } from '../../config.js'
import { QuestModel} from '../../models/quest.js';
let questModel = new QuestModel();


// 检测是否可以调用getUpdateManager检查更新


let updateManager = wx.getUpdateManager();
// 获取全局唯一的版本更新管理器，用于管理小程序更新
updateManager.onCheckForUpdate(function (res) {
    // 监听向微信后台请求检查更新结果事件 
    console.log("是否有新版本：" + res.hasUpdate);
    if (res.hasUpdate) {
        //如果有新版本                
        // 小程序有新版本，会主动触发下载操作        
        updateManager.onUpdateReady(function () {
            //当新版本下载完成，会进行回调          
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，单击确定重启小程序',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启小程序               
                        updateManager.applyUpdate();
                    }
                }
            })
        })
        // 小程序有新版本，会主动触发下载操作（无需开发者触发）        
        updateManager.onUpdateFailed(function () {
            //当新版本下载失败，会进行回调          
            wx.showModal({
                title: '提示',
                content: '检查到有新版本，但下载失败，请稍后尝试',
                showCancel: false,
            })
        })
    }
});


Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    getPhoneNumber(e){
        console.log(e)
        wx.checkSession({
            success: () => {
                // session_key 未过期，并且在本生命周期一直有效
                let { encryptedData, iv, errMsg } = e.detail;
                let session_key = wx.getStorageSync('token').session_key
                if (e.detail.errMsg == 'getPhoneNumber:fail user deny' || e.detail.errMsg == "getPhoneNumber:user deny") {
                    //拒绝
                    wx.navigateTo({
                        url: '/pages/login/index',
                    })
                } else {
                    //允许 
                    wx.showLoading()
                    questModel.bindMobilePhone({
                        type: 2,
                        encrypted: encryptedData,
                        iv,
                        sessionKey: session_key,
                        pwd: Math.random()
                    }).then(res => {
                       
                        wx.showToast({
                            title: res.data.msg,
                            duration:5000
                        })
                        
                        if(res.data.success){
                            this.login();
                            
                        }
                    })
                } 
            },
            fail() {
                // session_key 已经失效，需要重新执行登录流程
                wx.showModal({
                    title: '提示',
                    content: '登录失效,请重新登录',
                    showCancel:false,
                    success(){
                        wx.navigateTo({
                            url: '/pages/authorize/index',
                        })
                    }
                })
                
            }   
        })
        
    },
    login() {
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
    _login(code, encryptedData, iv) {
        wx.request({
            url: config.api_base_url + 'front/miniproWeChatLogin',
            header: {
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
                    
                    //是否绑定手机
                    wx.setStorageSync('isBindMobile', reslut.data.bindingMobile);
                    wx.navigateBack({
                        delta: 2
                    })
                } else {
                    wx.showToast({
                        title: reslut.msg,
                        icon: 'none',
                        duration: 1000
                    })
                }

               
            },
            fail: res => {
                console.log(res)
            },
            complete: res => {
                wx.hideLoading();
            }
        })
    }
    
})