// pages/kechen/index.js
import {
    config
} from '../../config.js';
import {
    VenueModel
} from '../../models/venue.js';

let venueModel = new VenueModel();


Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: config.base_img_url,
        typeList: [],
        venueList: [],
        sportTypeId: "",
        sortPriceKey: false,
        sortDistanceKey: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.setData({
            sportTypeId: "" //默认为(综合)
        })
        this._getSportType("")
        this._getNowData("");
    },
    //选择运动项目
    onSelectType(e) {
        let id = e.currentTarget.dataset.id; //运动类型Id
        this._addClass(id);
        this._getNowData(id);
    },
    //搜索
    onSearch(e) {
        let keyWords = e.detail.value.trim();
        if (!keyWords) return;
        console.log(keyWords)
        this._addClass();
        this._getNowData('', '', keyWords)
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
        let { sportTypeId, sortPriceKey } = this.data;
        this.setData({
            sortPriceKey: !sortPriceKey
        })
        if (sortPriceKey) {
            console.log(1)
            this._getNowData(sportTypeId, 1);
        } else {
            console.log(2)
            this._getNowData(sportTypeId, 2);
        }

    },
    //距离排序
    onSortDistance() {
        let { sportTypeId, sortDistanceKey } = this.data;
        this.setData({
            sortDistanceKey: !sortDistanceKey
        })
        if (sortDistanceKey) {
            this._getNowData(sportTypeId, 3);
        } else {
            this._getNowData(sportTypeId, 4);
        }
    },
    //获取运动类型
    _getSportType(id) {
        venueModel.getVenuetype().then(res => {
            let data = res.data.items;
            console.log(data)
            data.unshift({
                sort: 0,
                sport_type_id: '',
                type: 0,
                typeName: "综合"
            })
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
    _getNowData(id = '', num = '', venueName = '') {
        let nodecode = wx.getStorageSync('city').nodecode;
        venueModel.getVenueCourserList({
            sportId: id,
            city: nodecode,
            start: 0,
            limit: 6,
            types: num,
            venueName
        }).then(res => {
            console.log(res.data.items)
            this.setData({
                venueList: res.data.items
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