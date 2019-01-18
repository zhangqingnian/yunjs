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
    
        selectArr: [], //预约 最多4个
        isShowNews: false, 
        hour: [],
        date: [],
        field: [],
        areaWidth: '',
        defaultData: [],
        currentDate:'' //当前日期

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options)
        let openDate = new Date().getTime();
        let {
            id,
            sportTypeId,
            venue,
            sportName
        } = options;
        id = Number(id);
        sportTypeId = Number(sportTypeId);
        let hour = this._hour(9, 24);
        let date = this._date(14);
        this.setData({
            id,
            sportTypeId,
            hour,
            date,
            currentDate: date[0],
            venue,
            sportName
        });
        this._getField(id, sportTypeId, openDate);
    },
    //跳转 提交订单页
    onGoOrder(){
        let arr = this.data.selectArr;
        let venue = this.data.venue;
        let venueObj = JSON.parse(venue);
        if(!arr.length){
            wx.showToast({
                title: '请先预定场地',
                icon:'none'
            })
            return
        }
        wx.showModal({
            title: '提示',
            content: '预定场地不可退款\r\n场馆电话' + venueObj.venueMobile,
            success: res => {
                if (res.confirm) {
                    wx.navigateTo({
                        url: '/pages/confirmOrder/area/index?arr=' + JSON.stringify(arr) + '&venue=' + venue + '&sportName=' + this.data.sportName + '&sportTypeId=' + this.data.sportTypeId
                    })
                } 
            }    
        })
        
    },
    //选择日期
    onSelectDate(e){
        
        this.setData({
            selectArr: []   //清空
        })
        let { dateId, isOn } = e.currentTarget.dataset.item;
        if(isOn)return;
        let { id, sportTypeId}= this.data;
        let currentDate 
        this.data.date.forEach(item => {
            if (item.dateId == dateId){
                item.isOn = true;
                currentDate = item;
                this._getField(id, sportTypeId, item.openDate);
            }else{
                item.isOn = false;
            }
        })
        this.setData({
            date:this.data.date,
            currentDate
        })
        
    },
    //选择场次
    onSelect(e) {
        let _arr = this.data.selectArr; //已经预约的
        let maxLen = 4; //最大预约数
        let {item,area} = e.currentTarget.dataset;
        let {
            cvaoIsOpen,
            id
        } = item;
        if (!cvaoIsOpen) return; //点击不可预约 retrun


        let field = this.data.field;
        field.forEach(item => {
            item.venueAreaOpenTimes.forEach(items => {
                if (items.id == id) {
                    if (!items.isSelect) {
                        if (_arr.length < maxLen) {
                            items.isSelect = !items.isSelect
                            items.area = area;
                            items.currentDate = this.data.currentDate;
                            _arr.push(items);
                        } else {
                            wx.showToast({
                                title: '最多选择4个',
                                icon: 'none',
                                duration: 1000
                            })
                        }
                    } else {
                        _arr.forEach((e, index) => {
                            if (e.id == id) {
                                items.isSelect = !items.isSelect
                                _arr.splice(index, 1);
                            }
                        })
                    }
                }
            })
        })
        this.setData({
            field,
            selectArr:_arr
        })


    },
    onShowNews() {
        this.setData({
            isShowNews: true
        })
    },
    onClose() {
        this.setData({
            isShowNews: false
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
        wx.showLoading();
        venueModel.getField(id, sportTypeId, openDate).then(res => {
            wx.hideLoading();
            let area = res.data;
            console.log(area)
            this._setWidrh(area.length);
            this._default(area)
        })
    },
    _default(area) {
        let arr = [
                        {
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
                        }
        ];
        // let k = 0;
        // let newData = [];
        // for (var i = 0; i < area.length; i++) {
        //     newData = [];
        //     let a = area[i].venueAreaOpenTimes;
        //     area[i].venueAreaOpenTimes = arr;
        //     if (!a.length) return;
        //     outer: for (var j = 0; j < area[i].venueAreaOpenTimes.length; j++) {
        //         inter: for (k; k < area[i].venueAreaOpenTimes.length;) {
        //             if (k < a.length) {
        //                 if (a[k].cvaoStartTime == area[i].venueAreaOpenTimes[j].cvaoStartTime) {
        //                     newData.push(a[k]);
        //                     k++;
        //                     continue outer;
        //                 } else {
        //                     newData.push(area[i].venueAreaOpenTimes[j])
        //                     break inter;
        //                 }
        //             } else {
        //                 newData.push(area[i].venueAreaOpenTimes[j])
        //                 break inter;
        //             }

        //         }
        //     }
        //     if (newData.length != 0) {
        //         area[i].venueAreaOpenTimes = newData;
        //         k = 0;
        //     }
        // }
        for (let k = 0; k < area.length; k++) {
            let [...clon] = arr;
            let one = area[k].venueAreaOpenTimes;
            for (var i = 0; i < arr.length; i++) {
                for (let j = 0; j < one.length; j++) {
                    if (arr[i].cvaoStartTime == one[j].cvaoStartTime) {
                        arr[i] = one[j];
                    }

                }
            }
            area[k].venueAreaOpenTimes = arr;
            arr = clon;
        }

        let _arr = this.data.selectArr;
        area.forEach(item => {
            item.venueAreaOpenTimes.forEach(items => {
                items.isSelect = false;
                if(_arr.length){
                    _arr.forEach(e => {
                        if (e.id == items.id) {
                            items.isSelect = true;
                        }
                    })
                }           
            })
        })
        this.setData({
            field: area
        })
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
            if(i != 0){
               myDate.setDate(myDate.getDate() + 1)
            }
                
            let time = myDate.getTime();
            let year = myDate.getFullYear();
            let month = myDate.getMonth() + 1;
            let day = myDate.getDate();
            let week = weeks[myDate.getDay()];
            let obj = {
                date: month + '/' + day,
                week: week,
                openDate: time,
                formatDate:year+'-'+month+'-'+day,
                isOn:false,
                dateId:i
            }
            _arr.push(obj)
        }
        _arr[0].isOn = true;
        return _arr;
    }
})