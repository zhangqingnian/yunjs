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
    //使用
    onUse(e) {
        console.log(e.currentTarget.dataset.item)
        this.setData({
            card: e.currentTarget.dataset.item
        })
        let {id,type} = e.currentTarget.dataset.item;
        //会员卡
        if(type == 4){
            wx.navigateTo({
                url: './vipCard/index?id='+id,
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
        let { id, type } = e.currentTarget.dataset.item;
        wx.navigateTo({
            url: './record/index?id=' + id,
        })
    },
    onHide() {
        this.setData({
            show: false
        })
        this._getMyCard('valid', 0);
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
            invalid: false
        })
        this._getMyCard('valid', 0);

    },
    //无效
    onInvalid() {
        this.setData({
            valid: false,
            invalid: true
        })
        this._getMyCard('inValid', 0);

    },
    //我的课程 type 1有效 2无效
    _getMyCard(status, start) {
        wx.showLoading({
            title: '加载中'
        })
        cardModel.myCardList({
            status,
            start,
            limit: 10
        }).then(res => {
            wx.hideLoading();
            this.setData({
                cardList: res.data.items
            })
            console.log(res);
        }).catch(err => {
            wx.hideLoading();
        })
    }
})