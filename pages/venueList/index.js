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
        imgUrl: config.base_img_url,
        typeList: ['全部'],
        id:null,
        venueList:[],
        sportTypeId:null,
        total:0,
        rankingLength:0,
        sortDistanceKey:false,
        sortPriceKey:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let id = options.id;
        this.setData({
            sportTypeId:id
        })
        this.data.id = id;
        this.getType(id);
        this._getNowData(id)
        
    },
    //价格排序3 4
    onSortPrice() {
        let { sportTypeId, sortPriceKey } = this.data;
        this.setData({
            sortPriceKey: !sortPriceKey
        })
        if (sortPriceKey) {
            this._getNowData(sportTypeId,"", 3);
        } else {
            this._getNowData(sportTypeId,"", 4);
        }

    },
    //距离排序 5 6
    onSortDistance() {
        let { sportTypeId, sortDistanceKey } = this.data;
        this.setData({
            sortDistanceKey: !sortDistanceKey
        })
        if (sortDistanceKey) {
            this._getNowData(sportTypeId,"",5);
        } else {
            this._getNowData(sportTypeId,"", 6);
        }
    },
    //搜索
    onSearch(e) {
        let keyWords = e.detail.value.trim();
        if (!keyWords) return;
        console.log(keyWords)
        this._addClass();
        this._getNowData('', keyWords)
    },
    //选择运动项目
    selectType(e) {
        let id = e.currentTarget.dataset.id;
        this.setData({
            venueList: []
        })
        this._addClass(id); 
        this._getNowData(id)     
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
        let start = this.data.venueList.length - this.data.rankingLength;
        if(start >= total){
            return
        }
        this._loadMore(start)
    },
    _loadMore(start){
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
            limit: 20
        }).then(res => {
            wx.hideLoading()
            let temArr = this.data.venueList.concat(res.data.items)
            this.setData({
                venueList: temArr
            })
        })
    },
    //获取当前运动项目的场馆
    _getNowData(id, venueName = "", types) {
        let cityNodecode = wx.getStorageSync('city').nodecode || 3302;
        let currentLocation = wx.getStorageSync('currentLocation');
        wx.showLoading();
        venueModel.getVenueList({
            lon: currentLocation.longitude,
            lat: currentLocation.latitude,
            sportTypeId: id,
            venueName,
            types: types || 1,
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