// components/city/city.js

import {
    HistoryCity
} from '../../models/historyCity.js'
let history = new HistoryCity();

var city = require('../../utils/city.js');
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        currrentCity:String,
        cityLists:Array
    },

    /**
     * 组件的初始数据
     */
    data: {
        cityData: [],
        searchLetter: [],
        showLetter: "",
        winHeight: 0,
        cityList: [],
        isShowLetter: false,
        scrollTop: 0, //置顶高度
        scrollTopId: '', //置顶id
        hotcityList: [],
        searchReslut: [],
        isSearch: false
    },
    attached(){
        console.log('attached')
        var searchLetter = city.searchLetter; //首字母列表
        let cityList = this.filtercity(searchLetter, this.properties.cityLists) //格式化后的数据
        
        var sysInfo = wx.getSystemInfoSync(); //手机信息
        var winHeight = sysInfo.windowHeight; //高度
        var itemH = winHeight / searchLetter.length;
        var tempObj = [];
        for (var i = 0; i < searchLetter.length; i++) {
            var temp = {};
            temp.name = searchLetter[i];
            temp.tHeight = i * itemH;
            temp.bHeight = (i + 1) * itemH;
            tempObj.push(temp)
        }
        this.setData({
            cityData: this.properties.cityLists,
            winHeight: winHeight,
            itemH: itemH,
            searchLetter: tempObj,
            cityList: cityList,
            hotcityList: history.getHistoryCity()
        })
        
    },
    /**
     * 组件的方法列表
     */
    methods: {
        clickLetter: function (e) {
            console.log(e.currentTarget.dataset.letter)
            var showLetter = e.currentTarget.dataset.letter;
            this.setData({
                showLetter: showLetter,
                isShowLetter: true,
                scrollTopId: showLetter,
            })
            var that = this;
            setTimeout(function () {
                that.setData({
                    isShowLetter: false
                })
            }, 1000)
        },
        //选择城市
        bindCity: function (e) {
            let itemCity = e.currentTarget.dataset;
            history.addHistoryCity(itemCity);
            this.triggerEvent('city', itemCity, {})
            this.setData({
                city: itemCity.city
            })
        },
        //选择历史城市
        bindHotCity: function (e) {
            let itemCity = e.currentTarget.dataset;
            this.triggerEvent('city', itemCity, {});
            this.setData({
                city: itemCity.city
            })
            
        },
        //点击热门城市回到顶部
        hotCity: function () {
            this.setData({
                scrollTop: 0,
            })
        },
        onbindScroll(e) {
            //console.log(e);
        },
        onBindInpu(e) {
            this.setData({ isSearch: true });
            let val = e.detail.value.trim().toLowerCase();
            if (!val) {
                this.setData({ isSearch: false });
                return
            }
            let cityList = this.data.cityData;
            let searchReslut = this.search(val, cityList);
            this.setData({ searchReslut });
        },
        //对城市信息进行分组
        filtercity(searchLetter, cityObj) {
            var tempObj = [];
            for (var i = 0; i < searchLetter.length; i++) {
                var initial = searchLetter[i];
                var cityInfo = [];
                var tempArr = {};
                tempArr.initial = initial;
                for (var j = 0; j < cityObj.length; j++) {
                    if (initial == cityObj[j].spell.slice(0, 1).toUpperCase()) {
                        cityInfo.push(cityObj[j]);
                    }
                }
                tempArr.cityInfo = cityInfo;
                tempObj.push(tempArr);
            }
            return tempObj;
        },
        //搜索数据
        search(val, cityList) {
            //console.log(cityList)
            let _searchCity = []
            cityList.forEach(item => {
                let { city, spell } = item;
                if (city.indexOf(val) != -1 || spell.indexOf(val) != -1) {
                    _searchCity.push(item);
                }
            })

            return _searchCity
        },
        //取消搜索
        onCancel(){
            this.triggerEvent('cancel', {}, {})
        }
    }
})