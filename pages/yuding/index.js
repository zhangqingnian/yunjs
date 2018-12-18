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
        hour: [],
        date: [],
        field: [],
        areaWidth: '',
        defaultData: [],
        arr: [{
            "cvaoEndTime": "01:00",
            "cvaoIsOccupy": 0,
            "cvaoIsOpen": 0,
            "cvaoPrice": 0,
            "cvaoStartTime": "00:00",
            "id": 496823
        }, {
            "cvaoEndTime": "02:00",
            "cvaoIsOccupy": 0,
            "cvaoIsOpen": 0,
            "cvaoPrice": 0,
            "cvaoStartTime": "01:00",
            "id": 496823
        }, {
            "cvaoEndTime": "03:00",
            "cvaoIsOccupy": 0,
            "cvaoIsOpen": 0,
            "cvaoPrice": 0,
            "cvaoStartTime": "02:00",
            "id": 496823
        }, {
            "cvaoEndTime": "04:00",
            "cvaoIsOccupy": 0,
            "cvaoIsOpen": 0,
            "cvaoPrice": 0,
            "cvaoStartTime": "03:00",
            "id": 496823
        }, {

            "cvaoEndTime": "05:00",
            "cvaoIsOccupy": 0,
            "cvaoIsOpen": 0,
            "cvaoPrice": 0,
            "cvaoStartTime": "04:00",
            "id": 496823
        }, {
            "cvaoEndTime": "06:00",
            "cvaoIsOccupy": 0,
            "cvaoIsOpen": 0,
            "cvaoPrice": 0,
            "cvaoStartTime": "05:00",
            "id": 496823
        }, {
            "cvaoEndTime": "07:00",
            "cvaoIsOccupy": 0,
            "cvaoIsOpen": 0,
            "cvaoPrice": 0,
            "cvaoStartTime": "06:00",
            "id": 496823
        }, {
            "cvaoEndTime": "08:00",
            "cvaoIsOccupy": 0,
            "cvaoIsOpen": 0,
            "cvaoPrice": 0,
            "cvaoStartTime": "07:00",
            "id": 496823
        }, {
            "cvaoEndTime": "09:00",
            "cvaoIsOccupy": 0,
            "cvaoIsOpen": 0,
            "cvaoPrice": 0,
            "cvaoStartTime": "08:00",
            "id": 496823
        }, {
            "cvaoEndTime": "10:00",
            "cvaoIsOccupy": 0,
            "cvaoIsOpen": 0,
            "cvaoPrice": 0,
            "cvaoStartTime": "09:00",
            "id": 496823
        }, {
            "cvaoEndTime": "11:00",
            "cvaoIsOccupy": 0,
            "cvaoIsOpen": 0,
            "cvaoPrice": 0,
            "cvaoStartTime": "10:00",
            "id": 496825
        }, {
            "cvaoEndTime": "12:00",
            "cvaoIsOccupy": 0,
            "cvaoIsOpen": 0,
            "cvaoPrice": 0,
            "cvaoStartTime": "11:00",
            "id": 496827
        }, {
            "cvaoEndTime": "13:00",
            "cvaoIsOccupy": 0,
            "cvaoIsOpen": 0,
            "cvaoPrice": 0,
            "cvaoStartTime": "12:00",
            "id": 496829
        }, {
            "cvaoEndTime": "14:00",
            "cvaoIsOccupy": 0,
            "cvaoIsOpen": 0,
            "cvaoPrice": 0,
            "cvaoStartTime": "13:00",
            "id": 496831
        }, {
            "cvaoEndTime": "15:00",
            "cvaoIsOccupy": 0,
            "cvaoIsOpen": 0,
            "cvaoPrice": 0,
            "cvaoStartTime": "14:00",
            "id": 496833
        }, {
            "cvaoEndTime": "16:00",
            "cvaoIsOccupy": 0,
            "cvaoIsOpen": 0,
            "cvaoPrice": 0,
            "cvaoStartTime": "15:00",
            "id": 496835
        }, {
            "cvaoEndTime": "17:00",
            "cvaoIsOccupy": 0,
            "cvaoIsOpen": 0,
            "cvaoPrice": 0,
            "cvaoStartTime": "16:00",
            "id": 496837
        }, {
            "cvaoEndTime": "18:00",
            "cvaoIsOccupy": 0,
            "cvaoIsOpen": 0,
            "cvaoPrice": 0,
            "cvaoStartTime": "17:00",
            "id": 496839
        }, {
            "cvaoEndTime": "19:00",
            "cvaoIsOccupy": 0,
            "cvaoIsOpen": 0,
            "cvaoPrice": 0,
            "cvaoStartTime": "18:00",
            "id": 496841
        }, {
            "cvaoEndTime": "20:00",
            "cvaoIsOccupy": 0,
            "cvaoIsOpen": 0,
            "cvaoPrice": 0,
            "cvaoStartTime": "19:00",
            "id": 496843
        }, {
            "cvaoEndTime": "21:00",
            "cvaoIsOccupy": 0,
            "cvaoIsOpen": 0,
            "cvaoPrice": 0,
            "cvaoStartTime": "20:00",
            "id": 496845
        }, {
            "cvaoEndTime": "22:00",
            "cvaoIsOccupy": 0,
            "cvaoIsOpen": 0,
            "cvaoPrice": 0,
            "cvaoStartTime": "21:00",
            "id": 496847
        }, {
            "cvaoEndTime": "23:00",
            "cvaoIsOccupy": 0,
            "cvaoIsOpen": 0,
            "cvaoPrice": 0,
            "cvaoStartTime": "22:00",
            "id": 496849
        }, {
            "cvaoEndTime": "00:00",
            "cvaoIsOccupy": 0,
            "cvaoIsOpen": 0,
            "cvaoPrice": 0,
            "cvaoStartTime": "23:00",
            "id": 496851
        }]
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
        let hour = this._hour(0, 24);
        let date = this._date(14);
        this.setData({
            hour,
            date
        });
        this._getField(id, sportTypeId, openDate);
    },
    onMove(e) {
        console.log(e)
    },
    onShowNews() {
        this.setData({
            isShowNews: true
        })
    },
    _setWidrh(len) {
        let _one = 140;
        let areaWidth = _one * len + 'rpx';
        this.setData({
            areaWidth
        })
    },
    _getField(id, sportTypeId, openDate) {
        venueModel.getField(id, sportTypeId, openDate).then(res => {
            console.log(res.data)
            this._setWidrh(res.data.length);
            this._default(res.data)
            this.setData({
                field: res.data
            })
        })
    },
    _default(area) {
        this.data.hour.pop()
        let hour = this.data.hour;
        let arr = this.data.arr;
        let one = area[0].venueAreaOpenTimes;
        console.log(one)
        arr.forEach((item,index) => {
            one.forEach(items => {
                let a = item.cvaoStartTime
                let b = items.cvaoStartTime
                if (a === b) {
                    console.log('模板：' + items.cvaoIsOpen)
                    item = items
                    console.log(arr)
                }
            })           
        })
      

        // area.forEach((item,i) => {
        //     let a = item.venueAreaOpenTimes
        //     item.venueAreaOpenTimes = arr
        //     item.venueAreaOpenTimes.forEach(arrItem => {
        //         a.forEach(items => {
        //             if (items.cvaoStartTime == arrItem.cvaoStartTime) {
        //                 console.log("数据库值：" + items.cvaoIsOpen)
        //                 arrItem = items
        //                 console.log("本地值" + arrItem.cvaoIsOpen)
        //             }else{
        //                 arrItem.cvaoStartTime = '不可预约'
        //             }
        //         })
        //     })
        // })
        //console.log(area)
    },
    _hour(start, end) {
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
    _date(max) {
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