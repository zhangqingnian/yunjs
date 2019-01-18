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

let app = getApp();

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
        longitude:'',                  //经度
        TjCurrent: 0,
        ByCurrent: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        qqmapsdk = new QQMapWX({
            key: 'F4VBZ-CBM3U-O7IVA-2ROG5-IQLE5-HGBUQ'
        });
        
        this.getbanner();
        this.getbenyue();
        this.getVenuetype();
        this.getHot();
    },
    onShow: function () {
        let {nodecode,city }= wx.getStorageSync('city'); 
        console.log(nodecode)
        this.setData({
            city
        })
        this.gettuijian(nodecode)
    },
    onShareAppMessage(Object){

    },
    swiperChange(e){
        this.setData({
            TjCurrent: e.detail.current
        })
    },
    swiperChangeBy(e) {
        this.setData({
            ByCurrent: e.detail.current
        })
    },
    //轮播
    getbanner() {
        indexModel.getBanner().then(res => {
            console.log(res)
            this.setData({
                banner: res.data.items
            })
        })
    },
    //运动类型
    getVenuetype(){
        indexModel.getVenuetype().then(res => {
            this.setData({
                venuetype: res.data.items.slice(0,9)
            })
        })
    },
    //本月
    getbenyue() {
        indexModel.getBenyue().then(res => {
            this.setData({
                benyue:this._formatData(res.data.items,4)
            })
        })
    },
    //推荐
    gettuijian(nodeCode) {
        indexModel.getTuijian(nodeCode).then(res => {
            this.setData({
                tuijian: this._formatData(res.data.data,3)
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
        let item = e.currentTarget.dataset.item;
        wx.navigateTo({
            url: '/pages/webviwe/index?item=' + JSON.stringify(item)
        })
    },
    //选择城市 点击
    onSelectCity(e){ 
        wx.navigateTo({
            url: '/pages/cityList/index',
        })
        
        
    },
    
    //监听选择城市  调用
    onCity(e){
        let {city, nodecode} = e.detail;
        console.log(e.detail)
        wx.setStorageSync('city', e.detail)
        this.setData({
            selectCity: false,
            city:city
        })
        this.gettuijian(nodecode);
    },
    //点击icon 跳转场馆列表
    onGoVenuelist(e){
        let id = e.currentTarget.dataset.id || '';
        wx.navigateTo({
            url:'/pages/venueList/index?id='+id
        })
    },
   
    //热门课程点击
    onHotCourse(e){
        let item = e.currentTarget.dataset.item;
        app.globalData.hotCourse = item.venueTypeId;
        wx.switchTab({
            url: '/pages/kechen/index',
        })
    },
    //推荐场馆点击
    onTuijian(e){
        let item = e.currentTarget.dataset.item;
        wx.navigateTo({
            url: '/pages/venueList/venueDetail/index?id='+item.id,
        })
    },
    /* 
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
                wx.setStorageSync('currentLocation', { latitude, longitude})
                vm.getLocal(latitude, longitude)
            }
        })
    },
    // 获取当前地理位置
    getLocal: function (latitude, longitude) {
        let vm = this;
        qqmapsdk.reverseGeocoder({
            location: {
                latitude: latitude,
                longitude: longitude
            },
            success: (res) => {
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
                            this.gettuijian(item.nodeCode)
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
    },*/
    //格式化数据
    _formatData(arr, amount) {
        let num = arr.length % amount;
        var _arr = [];
        var _item = [];
        arr.forEach((e, i) => {
            _item.push(e)
            if (_item.length == amount) {
                _arr.push(_item);
                _item = [];
            }
        });
        if (num != 0) {
            _arr.push(arr.slice(arr.length - num))
        }
        return _arr
    },
    login(encryptedData, iv) {
        let that = this;
        wx.login({
            success(res) {
                //先wx.login()获取code 然后发送请求
                if (res.code) {
                    //发起网络请求
                    that._login(res.code, encryptedData, iv)
                }
            }
        })
    },
    //发起请求
    _login(code, encryptedData, iv,cb) {
        wx.showLoading({
            title: '登录中',
        })
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
                    if (!reslut.data.bindingMobile) {
                        wx.navigateTo({
                            url: '/pages/login/index',
                        })
                    } else {
                        // wx.switchTab({
                        //     url: '/pages/index/index'
                        // })
                        cb && cb();
                    }
                    
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