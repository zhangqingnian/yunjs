// pages/kechen/index.js
var QQMapWX = require('../../qqmap/qqmap-wx-jssdk.js');
var qqmapsdk;
import {
    config
} from '../../config.js';
import {
    VenueModel
} from '../../models/venue.js';
import {
    HistoryCity
} from '../../models/historyCity.js'
let history = new HistoryCity();
let venueModel = new VenueModel();

let app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        upOn: '/images/icon_up_on.png',
        upOff: '/images/icon_up_off.png',
        downOn: '/images/icon_down_on.png',
        downOff: '/images/icon_down_off.png',
        types: '',
        imgUrl: config.base_img_url,
        typeList: [],
        venueList: [],
        sportTypeId: "",
        sortPriceKey: false,
        sortDistanceKey: false,
        total:0,
        isLoading: true,
        
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
        
    },
    //选择运动项目
    onShow(){
        qqmapsdk = new QQMapWX({
            key: 'DHNBZ-4VT3P-W7SDZ-VB64V-JEAQS-L6BQS'
        });

        this.getUserLocation()
        let sportTypeId = app.globalData.hotCourse || '';
    
        this.setData({
            venueList: [],
            sportTypeId //默认为(综合)
        })
        this._getSportType(sportTypeId)
        this._getNowData({id:sportTypeId})
    },
    onHide(){
        app.globalData.hotCourse = null;
        this.setData({
            venueList: [],
            typeList: []
        })
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
                } else {
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
                //vm.getLocal(latitude, longitude)

            }
        })
    },
    // 获取当前地理位置
    getLocal: function (latitude, longitude) {
        wx.showLoading()
        let vm = this;
        qqmapsdk.reverseGeocoder({
            location: {
                latitude: latitude,
                longitude: longitude
            },
            coord_type: 3,
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
                        city: city,
                        cityLists: cityList
                    })
                    wx.hideLoading();

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
    },
    onLoadMore() {
        let types = this.data.types;
        let id = this.data.sportTypeId;
        let start = this.data.venueList.length;
        let total = this.data.total;
        if (start >= total) {
            return
        }
        if (this.data.isLoading) {
            this.data.isLoading = false;
            this._getNowData({ id, start, num: types })
        }
    },
    onSelectType(e) {
        let id = e.currentTarget.dataset.id; //运动类型Id
        this.setData({
            sportTypeId: id,
            venueList: []
        })
        this._addClass(id);
        this._getNowData({id});
    },
    //搜索
    onSearch(e) {
        let venueName = e.detail.value.trim();
        if (!venueName) return;
        this.setData({ venueList: [], venueName})
        this._addClass();
        this._getNowData({ venueName});
    },
    onGodetails(e) {
        console.log(e.currentTarget.dataset.item);
        let { id } = e.currentTarget.dataset.item;
        
            wx.navigateTo({
                url: './kechenDetails/index?id=' + id,
            })
        
    },
    //价格排序
    onSortPrice() {
        this.setData({ venueList: [] })
        let { sportTypeId, sortPriceKey } = this.data;
        
        this.setData({
            sortPriceKey: !sortPriceKey,
            types
        })
        let types = sortPriceKey ? 1 : 2
        this.setData({
            types
        })
        if (sortPriceKey) {
            this._getNowData({ id: sportTypeId, num: 1 });
        } else {
            this._getNowData({ id: sportTypeId, num: 2 });
        }

    },
    //距离排序
    onSortDistance() {
        this.setData({ venueList: [] })
        let { sportTypeId, sortDistanceKey } = this.data;
       
        this.setData({
            sortDistanceKey: !sortDistanceKey
        })
        let types = sortDistanceKey ? 3 : 4;
        this.setData({
            types
        })
        if (sortDistanceKey) {
            this._getNowData({ id: sportTypeId,  num: 3 });
        } else {
            this._getNowData({ id: sportTypeId,  num: 4 });
        }
    },
    //获取运动类型
    _getSportType(id) {
        venueModel.getVenuetype().then(res => {
            let data = res.data.items;
            data.unshift({
                sort: 0,
                sport_type_id:'',
                type: 0,
                typeName: "全部"
            })
            data.forEach(item => {
                if (item.sport_type_id == id){
                    item.isOn = true
                }else{
                    item.isOn = false
                }               
            })
            this.setData({
                typeList: data
            })
        })
    },
    //获取当前运动项目的场馆
    _getNowData({id = '',start = 0, num = ''}) {
        wx.showLoading({
            title: '拼命加载中...',
        })
        let nodecode = wx.getStorageSync('city').nodecode;
        let currentLocation = wx.getStorageSync('currentLocation');
        if (!currentLocation) {
            wx.showModal({
                title: '提示',
                content: '请重新授权位置信息',
                showCancel: false,
                success: () => {
                    wx.navigateTo({
                        url: '/pages/authorizeLocation/index',
                    })
                }
            })
            return
        }
        venueModel.getVenueCourserList({
            lon: currentLocation.longitude,
            lat: currentLocation.latitude,
            sportId: id,
            city: nodecode,
            start,
            limit: 10.,
            types: num,
            venueName:this.data.venueName || ''
        }).then(res => {
            wx.hideLoading();
            this.data.isLoading = true;
            let temArr = this.data.venueList.concat(res.data.items)
            console.log(temArr.length)
            this.setData({
                venueList: temArr,
                total: res.data.total
            })
        })
    },
    //添加选择样式
    _addClass(id) {
        this.data.typeList.forEach(item => {
            if (item.sport_type_id == id) {
                item.isOn = true;
            } else {
                item.isOn = false;
            }
        })
        this.setData({
            typeList: this.data.typeList
        })
    },
})