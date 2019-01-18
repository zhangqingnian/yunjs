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
        showRating:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let showRating = options.showRating ? true : false;
        let item = JSON.parse(options.item);
        this.setData({
            item,
            showRating
        })
        this._getNew(item.id);
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
            console.log(res);
            console.log(res.data[0])
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
    }
})