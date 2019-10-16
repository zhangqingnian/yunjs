// pages/authorizeLocation/index.js
import {
    HistoryCity
} from '../../models/historyCity.js'
let history = new HistoryCity();

var QQMapWX = require('../../qqmap/qqmap-wx-jssdk.js');
var qqmapsdk;

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

let app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        qqmapsdk = new QQMapWX({
            key: 'DHNBZ-4VT3P-W7SDZ-VB64V-JEAQS-L6BQS'
        });
        
        this.getUserLocation()
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },
    onBtn(){
        this.getUserLocation()
    },
    getUserLocation: function() {
        let vm = this;
        wx.getSetting({
            success: (res) => {
                if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
                    wx.showModal({
                        title: '请求授权当前位置',
                        content: '需要获取您的地理位置，请确认授权',
                        success: function(res) {
                            if (res.cancel) {
                                wx.showToast({
                                    title: '拒绝授权',
                                    icon: 'none',
                                    duration: 1000
                                })
                            } else if (res.confirm) {
                                wx.openSetting({
                                    success: function(dataAu) {
                                        if (dataAu.authSetting["scope.userLocation"] == true) {
                                            wx.showToast({
                                                title: '授权成功',
                                                icon: 'success',
                                                duration: 1000
                                            })
                                            //再次授权，调用wx.getLocation的API
                                            vm.getLocation();
                                        } else {
                                            wx.showToast({
                                                title: '授权失败',
                                                icon: 'none',
                                                duration: 1000
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })
                } else if (res.authSetting['scope.userLocation'] == undefined) {
                    //调用wx.getLocation的API
                    vm.getLocation();
                } else {
                    //调用wx.getLocation的API
                    let { nodecode, city } = wx.getStorageSync('city');
                    if (nodecode) {
                        wx.switchTab({
                            url: '/pages/index/index'
                        })
                        return
                    }
                    vm.getLocation();
                }
            }
        })
    },
    // 微信获得经纬度
    getLocation: function() {
        
        let vm = this;
        wx.getLocation({
            type: 'gcj02',
            success: (res) => {
                var latitude = res.latitude
                var longitude = res.longitude
                var speed = res.speed
                var accuracy = res.accuracy;
                let objLocation = this.qqMapTransBMap(longitude, latitude)
                latitude = objLocation.latitude
                longitude = objLocation.longitude
                wx.setStorageSync('currentLocation', {
                    longitude,
                    latitude
                })
                vm.getLocal(latitude, longitude)
                
            }
        })
    },
    // 获取当前地理位置
    getLocal: function(latitude, longitude) {
        wx.showLoading()
        let vm = this;
        qqmapsdk.reverseGeocoder({
            location: {
                latitude: latitude,
                longitude: longitude
            },
            coord_type:3,
            success: (res) => {
                let province = res.result.ad_info.province
                let city = res.result.ad_info.city
                history.getCity().then(res => {
                    let cityList = res.data;

                    cityList.forEach(item => {
                        if (item.city == city) {
                            wx.setStorageSync('city', {
                                "city": item.city,
                                nodecode: item.nodeCode
                            })
                        }
                    })
                    wx.setStorageSync('cityObj', {
                        province: province,
                        city:city,
                        cityLists: cityList
                    })
                    wx.hideLoading();
                    wx.switchTab({
                        url: '/pages/index/index'
                    })
                    // app.globalData.province = province;
                    // app.globalData.city = city;
                    // app.globalData.cityLists = cityList;
                   
                })

                
            }
        });
    },
    qqMapTransBMap(longitude, latitude) {
        let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
        let x = longitude;
        let y = latitude;
        let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
        let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
        let lngs = z * Math.cos(theta) + 0.0065;
        let lats = z * Math.sin(theta) + 0.006;
        return {
            longitude: lngs,
            latitude: lats
        }
    }
})