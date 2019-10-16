// pages/my/card/index.js
import { config } from '../../../config.js'
import { CardModel } from '../../../models/card.js'

let cardModel = new CardModel();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        show: false,
        valid: true,
        invalid: false,
        status: 'valid',
        cardList: [],
        card:{},
        baseUrl: config.api_base_url,
        imgUrl: config.base_img_url,
        codeSrc: "m/crm/myCards/front/getVenueCardCodeAndTimesForCustomer?id=",
        codeUrl: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this._getMyCard('valid', 0);
    },
    onReachBottom(){
        let start = this.data.cardList.length;
        let status = this.data.status;
        let total = this.data.total;
        if (start >= total) return;
        this._getMyCard(status,start);
        
    },
    //使用
    onUse(e) {
        let card = e.currentTarget.dataset.item;
        this.setData({
            card
        })
        let { id, type, fileName} = card;
        //会员卡
        if(type == 4){
            wx.navigateTo({
                url: './vipCard/index?id=' + id + '&vipImg=' + config.base_img_url + fileName,
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



    },
    //使用记录
    onRecord(e) {
        let { id } = e.currentTarget.dataset.item;
        wx.navigateTo({
            url: './record/index?id=' + id,
        })
    },
    
    //去详情
    onGoDetail(e) {
        let item = e.currentTarget.dataset.item;
        let valid = this.data.valid;
        wx.navigateTo({
            url: './detail/index?item=' + JSON.stringify(item) + '&valid=' + valid
        })
    },
    //有效
    onValid() {
        this.setData({
            valid: true,
            invalid: false,
            status: 'valid',
            cardList:[]
        })
        this._getMyCard('valid', 0);

    },
    //无效
    onInvalid() {
        this.setData({
            valid: false,
            invalid: true,
            status: 'inValid',
            cardList:[]
        })
        this._getMyCard('inValid', 0);

    },
    onHides() {
        this.setData({
            show: false
        })
    },
    //我的课程 type 1有效 2无效
    _getMyCard(status, start) {
        wx.showLoading()
        cardModel.myCardList({
            status,
            start,
            limit: 20
        }).then(res => {
            wx.hideLoading();
            let temArr = this.data.cardList.concat(res.data.items)
            this.setData({
                cardList: temArr,
                total:res.data.total
            })
        }).catch(err => {
            wx.hideLoading();
        })
    }
})