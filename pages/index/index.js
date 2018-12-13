var QQMapWX = require('../../qqmap/qqmap-wx-jssdk.js');
var qqmapsdk;

import {
    config
} from '../../config.js';
import {
    IndexModel
} from '../../models/index.js';
import {
    HistoryCity
} from '../../models/historyCity.js'
let history = new HistoryCity();
let indexModel = new IndexModel();



Page({

    /**
     * 页面的初始数据
     */
    data: {
        cityLists:[],
        imgUrl: config.base_img_url,   //图片前缀
        banner: [],                    //轮播图
        venuetype:[],                 //运动类型  
        benyue: [],                    //本月活动
        tuijian: [],                   //推荐  
        hot:[],                        //热门
        selectCity:false,               //选择城市 控制city组件显示
        province:'',
        city:'',                      //当前城市
        latitude:'',                  //纬度
        longitude:''                  //经度
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        qqmapsdk = new QQMapWX({
            key: 'F4VBZ-CBM3U-O7IVA-2ROG5-IQLE5-HGBUQ'
        });
        
        this.getUserLocation();
        let { city, nodecode } = wx.getStorageSync('city') || {city:'',nodecode:''};
        this.getbanner();
        this.getbenyue();
        this.gettuijian(nodecode);
        this.getVenuetype();
        this.getHot();
    },
    //轮播
    getbanner() {
        indexModel.getBanner().then(res => {
            this.setData({
                banner: res.data
            })
        })
    },
    //运动类型
    getVenuetype(){
        indexModel.getVenuetype().then(res => {
            this.setData({
                venuetype: res.data.items
            })
        })
    },
    //本月
    getbenyue() {
        indexModel.getBenyue().then(res => {
            this.setData({
                benyue: res.data
            })
        })
    },
    //推荐
    gettuijian(nodeCode) {
        indexModel.getTuijian(nodeCode).then(res => {
            this.setData({
                tuijian: res.data.data || []
            })
        })
    },
    //热门
    getHot(){
        indexModel.getHot().then(res => {
            this.setData({
                hot: res.data.items
            })
        })
    },
    //webview
    goWebview(e) {
        let path = e.currentTarget.dataset.path;
        wx.navigateTo({
            url: '/pages/webviwe/index?path=' + path
        })
    },
    //选择城市
    onSelectCity(e){ 
        this.setData({
            selectCity:true
        })
    },
    //监听"取消"
    onCancel(){
        this.setData({
            selectCity: false
        })
    },
    //监听选择城市
    onCity(e){
        let {city, nodecode} = e.detail;
        wx.setStorageSync('city', e.detail)
        this.setData({
            selectCity: false,
            city:city
        })
    },
    //点击icon 跳转场馆列表
    onGoVenuelist(e){
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url:'/pages/venueList/index?id='+id
        })
    },
    onShow: function () {
        //this.getUserLocation();
    },
    getUserLocation: function () {
        let vm = this;
        wx.getSetting({
            success: (res) => {
                if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
                    wx.showModal({
                        title: '请求授权当前位置',
                        content: '需要获取您的地理位置，请确认授权',
                        success: function (res) {
                            if (res.cancel) {
                                wx.showToast({
                                    title: '拒绝授权',
                                    icon: 'none',
                                    duration: 1000
                                })
                            } else if (res.confirm) {
                                wx.openSetting({
                                    success: function (dataAu) {
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
                }
                else {
                    //调用wx.getLocation的API
                    vm.getLocation();
                }
            }
        })
    },
    // 微信获得经纬度
    getLocation: function () {
        let vm = this;
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                var latitude = res.latitude
                var longitude = res.longitude
                var speed = res.speed
                var accuracy = res.accuracy;
                console.log("获得经纬度")
                vm.getLocal(latitude, longitude)
            }
        })
    },
    // 获取当前地理位置
    getLocal: function (latitude, longitude) {
        console.log("获取当前地理位置")
        let vm = this;
        qqmapsdk.reverseGeocoder({
            location: {
                latitude: latitude,
                longitude: longitude
            },
            success: function (res) {
                let province = res.result.ad_info.province
                let city = res.result.ad_info.city
                console.log(city);
                history.getCity().then(res => {
                    let cityList = res.data;
                    
                    cityList.forEach(item => {
                        if(item.city == city){
                            wx.setStorageSync('city', {
                                "city":item.city,
                                nodecode:item.nodeCode
                            })
                        }
                    })

                    vm.setData({
                        province: province,
                        city: city,
                        latitude: latitude,
                        longitude: longitude,
                        cityLists: cityList
                    })
                })
                

            }
        });
    },
    //获取城市列表
    getCity(){
        
    }
})