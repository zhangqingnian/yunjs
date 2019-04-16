// pages/card/shop/index.js
import {
    config
} from '../../../config.js';
import {
    CardModel
} from '../../../models/card.js';
let cardModel = new CardModel();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: config.base_img_url,
        customerId: '', //分销员用户ID 
        goods: [],
        isLoading: true,
        shop: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let nickName = decodeURIComponent(options.nickName);
        let customerId = options.customerId;
        this.setData({
            customerId,
            nickName
        })
        wx.setNavigationBarTitle({
            title: nickName + '的店铺'
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let customerId = this.data.customerId;
        this.setData({ goods : []})
        this._recommendList({ customerId});
    },
    //订购
    onOrder(e) {
        let item = e.currentTarget.dataset.item;
        let customerId = this.data.customerId;
        let nickName = this.data.nickName;
        //id 排序id   venueGoodsId 商品id   packageId 任务id
        //cardsOrCourseType  1课程 2馆卡
        var url = item.cardsOrCourseType == 1 ?
            '/pages/share/venueCourseDetails/index?id=' + item.id + '&venueGoodsId=' + item.venueGoodsId + '&packageId=' + item.packageId + '&customerId=' + customerId + '&nickName=' + nickName + '&type=' +item.type :
            '/pages/share/venueCardDetails/index?id=' + item.id + '&venueGoodsId=' + item.venueGoodsId + '&packageId=' + item.packageId + '&customerId=' + customerId + '&nickName=' + nickName + '&type=' + item.type


        wx.navigateTo({
            url,
        })
    },
   
    onReachBottom: function () {
        let start = this.data.goods.length;
        let total = this.data.total;
        let customerId = this.data.customerId;
        if (start >= total) {
            return
        }
        if (this.data.isLoading) {
            this.data.isLoading = false;
            this._recommendList({ start, customerId })
        }
    },

    _recommendList({ shop = 1, start = 0, limit = 10, customerId }) {
        wx.showLoading();
        cardModel.recommendList({
            shop,
            start,
            limit,
            customerId
        }).then(res => {
            console.log(res.data.data)
            wx.hideLoading();
            this.data.isLoading = true;
            if (!res.data.success) {
                wx.showToast({
                    title: res.data.msg
                })
                return;
            }
            let temArr = this.data.goods.concat(res.data.data.items)
            this.setData({
                goods: temArr,
                total: res.data.data.total
            })
        })
    }
})