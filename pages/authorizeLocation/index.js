// pages/authorizeLocation/index.js
import {
    HistoryCity
} from '../../models/historyCity.js'
let history = new HistoryCity();

var QQMapWX = require('../../qqmap/qqmap-wx-jssdk.js');
var qqmapsdk;

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
            key: 'F4VBZ-CBM3U-O7IVA-2ROG5-IQLE5-HGBUQ'
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
                    console.log(22222)
                } else {
                    //调用wx.getLocation的API
                    wx.switchTab({
                        url: '/pages/index/index'
                    })
                }
            }
        })
    },
    // 微信获得经纬度
    getLocation: function() {
        wx.showLoading()
        let vm = this;
        wx.getLocation({
            type: 'wgs84',
            success: function(res) {
                var latitude = res.latitude
                var longitude = res.longitude
                var speed = res.speed
                var accuracy = res.accuracy;
                wx.setStorageSync('currentLocation', {
                    latitude,
                    longitude
                })
                vm.getLocal(latitude, longitude, function(){
                    wx.hideLoading();
                })
                
            }
        })
    },
    // 获取当前地理位置
    getLocal: function(latitude, longitude,cb) {
        console.log(44444444444)
        let vm = this;
        qqmapsdk.reverseGeocoder({
            location: {
                latitude: latitude,
                longitude: longitude
            },
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
                    cb && cb();
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
})