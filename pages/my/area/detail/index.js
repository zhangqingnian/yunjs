// pages/my/area/detail/index.js
import {
    config
} from '../../../../config.js';
import { AreaModel } from '../../../../models/area.js'

let areaModel = new AreaModel();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        show: false,
        area:{},
        baseUrl: config.api_base_url,
        imgUrl: config.base_img_url,
        codeSrc: "m/crm/venueOrder/front/getVerificationCode?orderCode=",
        codeUrl: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let { id, valid} = options;
        console.log(valid)
        this.setData({
            id,
            valid: valid == 'true'?true:false
        })
        this._getNew(id);
    },
    onHide() {
        this.setData({
            show: false
        })
    },
    onUse(){
        wx.showLoading({
            title: '加载中'
        })
        let ticket =this.data.area;
        let url = this.data.baseUrl + this.data.codeSrc + ticket.orderCode
        this.setData({
            show: true,
            ticket,
            codeUrl: url
        }, () => {
            wx.hideLoading();
        })
    },
    _getNew(id){
        areaModel.myAreaDetail({
            orderId:id
        }).then(res => {
            console.log(res.data[0])
            let area = res.data[0];
            this._area(area)
            this.setData({
                area
            })
        })
    },
    _area(area){
        let arr = area.areaName.split('|');
        console.log(arr)
        this.setData({
            areaName:arr
        })
    }
})