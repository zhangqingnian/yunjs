// pages/my/card/detail/index.js
import {
    config
} from '../../../../config.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        baseUrl: config.api_base_url,
        imgUrl: config.base_img_url,
        codeSrc: "m/crm/myCards/front/getVenueCardCodeAndTimesForCustomer?id=",
        codeUrl: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let card = JSON.parse(options.item);
        console.log(card);
        let valid = options.valid;
        this.setData({
            card,
            valid
        })
    },
    onHide() {
        this.setData({
            show: false
        })
    },
    onUse(e){
        /*
        type  0次数卡 1月卡 2 季卡 3年卡 4会员卡 5学期卡
        */ 
        let id = e.currentTarget.dataset.id;
        let types = this.data.card.type;
        if(types == 4){
            wx.navigateTo({
                url: '../vipCard/index?id='+id,
            })
            return
        }

        //其它种类
        wx.showLoading({
            title: '加载中'
        })
        let url = this.data.baseUrl + this.data.codeSrc + id
        this.setData({
            show: true,
            codeUrl: url

        }, () => {
            wx.hideLoading();
        })


    }

})