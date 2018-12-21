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
        typeList: ['综合'],
        id:null,
        venueList:[],
        sportTypeId:null
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
    //选择运动项目
    selectType(e) {
        let id = e.currentTarget.dataset.id;
        this._addClass(id); 
        this._getNowData(id)     
    },
    //获取运动项目
    getType(id){
        indexModel.getVenuetype().then(res => {
            let data = res.data.items;
            console.log(data)
            data.unshift({ sort: 0, sport_type_id: '', type: 0, typeName: "综合" })
            data.forEach(item => {
                item.isOn = false
            })
            this.setData({
                typeList: data
            })
            this._addClass(id);
        })
    },
    //获取当前运动项目的场馆
    _getNowData(id) {
        let cityNodecode = wx.getStorageSync('city').nodecode || 3302;
        venueModel.getVenueList({
            sportTypeId: id,
            city: cityNodecode,
            start:0,
            limit:6
        }).then(res => {
            console.log(res)
            this.setData({
                venueList:res.data.items
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