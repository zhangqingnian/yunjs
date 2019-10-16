// pages/my/order/areaDetail/index.js
import {
    AreaModel
} from '../../../../models/area.js'

let areaModel = new AreaModel();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        showRating:false,
        tickeTime:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let showRating = options.showRating ? true : false;
        let item = JSON.parse(options.item);
        console.log(item);
        this.setData({
            item,
            showRating,
        })
        this._getNew(item.id);
        if(item.orderType == 24){
            this._getTickeTime(item.id)
        }
    },
    onPay(){
        wx.navigateTo({
            url: '../cashier/index?item='+JSON.stringify(this.data.item)
        })
    },
    onRating(){
        this.setData({
            showRating:true
        })
    },
    onClose(){
        this.setData({
            showRating: false
        })
    },
    _getNew(id) {
        areaModel.myAreaDetail({
            orderId: id
        }).then(res => {
            let area = res.data[0];
            if(area.orderType == 15){
                this._area(area)
            }
            
            this.setData({
                area
            })
        })
    },
    _area(area) {
        let arr = area.areaName.split('|');
        this.setData({
            areaName: arr
        })
    },
    _getTickeTime(id){
        areaModel.myTickeTime({
            orderId: id
        }).then(res => {
            this.setData({
                tickeTime: res.data.data.entranceticketVos || []
            })
        })
    }
})