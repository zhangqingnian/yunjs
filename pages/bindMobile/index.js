// pages/bindMobile/index.js
import { config } from '../../config.js'
import { QuestModel} from '../../models/quest.js';
let questModel = new QuestModel();





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