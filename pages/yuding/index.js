// pages/yuding/index.js
import {
    VenueModel
} from '../../models/venue.js';

let venueModel = new VenueModel();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShowNews: false,
        hour:[],
        date:[],
        field:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let openDate = new Date().getTime();
        let {
            id,
            sportTypeId
        } = options;
        id = Number(id);
        sportTypeId = Number(sportTypeId);
        let hour = this._hour(9,24);
        let date = this._date(14);
        this.setData({
            hour,
            date
        });
        this._getField(id, sportTypeId, openDate);
    },

    onShowNews() {
        this.setData({
            isShowNews: true
        })
    },
    _getField(id, sportTypeId, openDate){
        venueModel.getField(id, sportTypeId, openDate).then(res => {
            console.log(res.data)
            this.setData({
                field:res.data
            })
        })
    },
    _hour(start,end){
        var _arr = [];
        for (var i = start; i <= end; i++) {
            if (i < 10) {
                i = '0' + i
            }
            var hour = i + ':00';
            _arr.push(hour)
        }
        return _arr;
    },
    _date(max){
        let _arr = [];
        let weeks = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        let myDate = new Date();

        for (let i = 0; i < max; i++) {
            myDate.setDate(myDate.getDate() + 1)
            let month = myDate.getMonth() + 1;
            let day = myDate.getDate();
            let week = weeks[myDate.getDay()];
            let obj = {
                date: month + '/' + day,
                week: week
            }
            _arr.push(obj)
        }
        return _arr;
    }
})