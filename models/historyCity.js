import {
    Http
} from '../utils/http.js';

export class HistoryCity extends Http {
    key = 'historyCity';
    maxLength = 4;

    getHistoryCity(){
        return wx.getStorageSync(this.key) || []
    }

    addHistoryCity(val){
        let arr = this.getHistoryCity();
        let len = arr.length;
        //判断是否存在
        if (JSON.stringify(arr).indexOf(JSON.stringify(val)) != -1) {
            return
        }
        //如果超过最大maxLength 删除尾 添加头；
        if (len >= this.maxLength) {
            arr.pop();
        }
        arr.unshift(val);
        wx.setStorageSync(this.key, arr)
    }

    //获取城市
    getCity(cityName) {
        return this.request({
            url: '/m/sys/city/front/selectAllCity?city='+cityName,
            method: 'POST'
        })
    }

}