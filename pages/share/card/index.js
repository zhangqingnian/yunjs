// pages/card/index.js
let app = getApp();

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
        isShare: false, //是否显示海报层(太阳码)
        isSelect: false, //是否显示选择框
        imgUrl: config.base_img_url,
        userInfo:{},
        customerId: '', //分销员用户ID 
        goods:[],
        isLoading: true,
        src:'',
        remark:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options)
        let customerId = options.customerId || decodeURIComponent(options.scene);
        this.setData({
            customerId
        })
    },
    onShow(){
        let customerId = this.data.customerId;
        this.setData({ goods:[]})
        this._getCard(customerId);
        this._recommendList({ customerId });
    },
    //生成图片层
    onShare() {
        this.setData({
            isShare: true,
            isSelect: false
        })
    },
    //关闭图片层
    onCloseShare() {
        this.setData({
            isShare: false
        })
    },
    //显示选择框
    onSelect() {
        this.setData({
            isSelect: true
        })
    },
    //关闭选择框
    onCancelSelect() {
        this.setData({
            isSelect: false
        })
    },
    //进入店铺
    goShop(){
        let nickName = this.data.nickName;
        let customerId = this.data.customerId;
        console.log(nickName+':'+customerId)
        wx.navigateTo({
            url: '/pages/share/shop/index?nickName=' + nickName + '&customerId='+ customerId,
        })
    },
    //订购 进入详情
    onOrder(e){
        let item = e.currentTarget.dataset.item;
        let customerId = this.data.customerId;
        let nickName = this.data.nickName;
        //id 排序id   venueGoodsId 商品id   packageId 任务id
        //cardsOrCourseType  1课程 2馆卡
        var url = '';
        if (item.cardsOrCourseType == 1){
            url = item.cardsOrCourseType = '/pages/share/venueCourseDetails/index?id=' + item.id + '&venueGoodsId=' + item.venueGoodsId + '&packageId=' + item.packageId + '&customerId=' + customerId + '&nickName=' + nickName + '&type=' + item.type
        }else {
            if (item.goodsType == 5){
                url = '/pages/share/termCardDetails/index?id=' + item.id + '&venueGoodsId=' + item.venueGoodsId + '&packageId=' + item.packageId + '&customerId=' + customerId + '&nickName=' + nickName + '&type=' + item.type
            }else{
                url = '/pages/share/venueCardDetails/index?id=' + item.id + '&venueGoodsId=' + item.venueGoodsId + '&packageId=' + item.packageId + '&customerId=' + customerId + '&nickName=' + nickName + '&type=' + item.type
            }
            
        }
        wx.navigateTo({
            url,
        })
    },
    onLoadMore(){
        let start = this.data.goods.length;
        let customerId = this.data.customerId;
        let total = this.data.total;
        if (start >= total) {
            return
        }
        if (this.data.isLoading) {
            this.data.isLoading = false;
            this._recommendList({ start, customerId })
        }
    },
    
    onShareAppMessage: function(res) {
        let customerId = this.data.customerId;
        let title = this.data.nickName + '的名片'
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title,
            path: '/pages/share/card/index?customerId=' + customerId
        }
        /* 
        title	转发标题	当前小程序名称
        path	转发路径	当前页面 path ，必须是以 / 开头的完整路径
        imageUrl	自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。
                    显示图片长宽比是 5: 4。	使用默认截图	
        */
    },
    _getCard(customerId=''){
        cardModel.getCard({
            customerId
        }).then(res => {
            if(!res.data.success){
                wx.showToast({
                    title: res.data.msg
                })
                return;
            }
            let nickName = res.data.data.nickName
            wx.setNavigationBarTitle({
                title: nickName + '的名片'
            })
            this.setData({
                userInfo:res.data.data,
                src: res.data.data.color ? config.base_img_url + res.data.data.color : '',
                remark:res.data.data.remark || '',
                customerId: res.data.data.customerId,
                nickName
            })
        })
    },
    _recommendList({ shop = 1, start = 0, limit = 10, customerId=""}) {
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
                total:res.data.data.total
            })
        })
    }
})