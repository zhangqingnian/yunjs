// pages/kechen/index.js
import {
    config
} from '../../config.js';
import {
    VenueModel
} from '../../models/venue.js';

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
        isLoading: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
        
    },
    //选择运动项目
    onShow(){
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
        let keyWords = e.detail.value.trim();
        if (!keyWords) return;
        console.log(keyWords)
        this.setData({ venueList: [] })
        this._addClass();
        this._getNowData({ venueName: keyWords });
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
    _getNowData({id = '',start = 0, num = '', venueName = ''}) {
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
            venueName
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