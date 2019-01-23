// pages/venueList/index.js
import {
    config
} from '../../config.js';
import Data from '../../mock/data.js';
import {
    IndexModel
} from '../../models/index.js';
import {
    VenueModel
} from '../../models/venue.js';

let indexModel = new IndexModel();
let venueModel = new VenueModel();


Page({

    /**
     * 页面的初始数据
     */
    data: {
        upOn:'/images/icon_up_on.png',
        upOff:'/images/icon_up_off.png',
        downOn:'/images/icon_down_on.png',
        downOff:'/images/icon_down_off.png',
        imgUrl: config.base_img_url,
        typeList: ['全部'],
        id:null,
        venueList:[],
        sportTypeId:null,
        total:0,
        rankingLength:0,
        sortDistanceKey:false,
        sortPriceKey:false,
        types:"",
        isLoading:true,
        keyWords:''  //关键字搜索
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        let { id, focus }= options;
        let isFocus = focus == 'true' ? true : false;
        this.setData({
            sportTypeId:id,
            isFocus
        })
        this.data.id = id;
        this.getType(id);
        this._getNowData({id})
        
    },
    //价格排序3 4
    onSortPrice() {
        let { sportTypeId, sortPriceKey } = this.data;
        let types = !sortPriceKey ? 3 : 4
        this.setData({
            sortPriceKey: !sortPriceKey,
            types
        })
        this.setData({
            venueList:[]
        })
        if (sortPriceKey) {
            this._getNowData({ id: sportTypeId, types: 3 });
        } else {
            this._getNowData({ id: sportTypeId, types: 4 });
        }

    },
    //距离排序 5 6
    onSortDistance() {
        let { sportTypeId, sortDistanceKey } = this.data;
        let types = !sortDistanceKey ? 5 : 6
        this.setData({
            sortDistanceKey: !sortDistanceKey,
            types
        })
        this.setData({
            venueList: []
        })
        if (sortDistanceKey) {
            this._getNowData({ id: sportTypeId, types: 6 });
        } else {
            this._getNowData({id:sportTypeId,types:5});
        }
    },
    //搜索
    onSearch(e) {
        let keyWords = e.detail.value.trim();
        if (!keyWords) return;
        this.setData({
            venueList: [],
            keyWords
        })
        this._addClass();
        this._getNowData({ venueName: keyWords})
    },
    //选择运动项目
    selectType(e) {
        let id = e.currentTarget.dataset.id;
        console.log(id);
        this.setData({
            venueList: [],
            sportTypeId:id,
            keyWords:''
        })
        this._addClass(id); 
        this._getNowData({id})     
    },
    //获取运动项目
    getType(id){
        indexModel.getVenuetype().then(res => {
            let data = res.data.items;
            data.unshift({ sort: 0, sport_type_id: '', type: 0, typeName: "全部" })
            data.forEach(item => {
                item.isOn = false
            })
            this.setData({
                typeList: data
            })
            this._addClass(id);
        })
    },
    //加载更多
    onLoadMore(){
        let total = this.data.total;
        let types = this.data.types;
        let keyWords = this.data.keyWords;
        let sportTypeId = this.data.sportTypeId;
        let start = this.data.venueList.length - this.data.rankingLength;
        if(start >= total)return;
        
        if (this.data.isLoading){
            this.data.isLoading = false;
            this._loadMore({ start, types, keyWords })
        }
        
    },
    _loadMore({ start, types, venueName = ''}){
        let sportTypeId = this.data.sportTypeId;
        let cityNodecode = wx.getStorageSync('city').nodecode || 3302;
        let currentLocation = wx.getStorageSync('currentLocation');
        wx.showLoading();
        venueModel.getVenueList({
            lon: currentLocation.longitude,
            lat: currentLocation.latitude,
            sportTypeId,
            city: cityNodecode,
            start,
            types,
            venueName,
            limit: 20
        }).then(res => {
            wx.hideLoading()
            this.data.isLoading = true;
            let temArr = this.data.venueList.concat(res.data.items)
            this.setData({
                venueList: temArr
            })
        })
    },
    //获取当前运动项目的场馆
    _getNowData({id = '',start = 0, venueName = "", types = 1}) {
        let cityNodecode = wx.getStorageSync('city').nodecode || 3302;
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
        }
        wx.showLoading();
        venueModel.getVenueList({
            lon: currentLocation.longitude,
            lat: currentLocation.latitude,
            sportTypeId: id,
            venueName,
            types,
            city: cityNodecode,
            start:0,
            limit:6
        }).then(res => {
            this.setData({
                total:res.data.total
            })      
            this._getRanking(id, res.data.items) //前三场馆
        })
    },
    //前三场馆
    _getRanking(sportTypeId = null,arr){
        let city = wx.getStorageSync('city').nodecode;
        let currentLocation = wx.getStorageSync('currentLocation');
        venueModel.getRanking({
            lon: currentLocation.longitude,
            lat: currentLocation.latitude,
            sportTypeId,
            city
        }).then(res => {
            wx.hideLoading();
            let reslutArr = res.data.data;
            reslutArr.forEach(item => {
                item.hot = true;   //添加推荐标识
            })
            let venueList = reslutArr.concat(arr)
            
            this.setData({
                venueList,
                rankingLength: reslutArr.length
            })
        })
    },
    //添加选择样式
    _addClass(id){
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
    //跳转场馆详情页
    onGoDetails(e){
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: './venueDetail/index?id=' + id + '&sportTypeId=' + this.data.sportTypeId,
        })
    }


})