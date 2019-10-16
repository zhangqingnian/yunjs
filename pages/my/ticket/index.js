// pages/my/ticket/index.js
import {config} from '../../../config.js'
import {TicketModel} from '../../../models/ticket.js'

let ticketModel = new TicketModel();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        valid: true,
        invalid: false,
        type:1,
        ticketList:[],
        show:false,
        ticket:{},
        baseUrl: config.api_base_url,
        imgUrl: config.base_img_url,
        codeSrc: "m/crm/venueOrder/front/getVerificationCode?orderCode=",
        codeUrl: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this._getMyTicket(1,0);
    },
    onReachBottom() {
        let start = this.data.ticketList.length;
        let type = this.data.type;
        let total = this.data.total;
        if (start >= total) return;
        this._getMyTicket(type, start);

    },
    onUser(e){
        wx.showLoading({
            title: '加载中'
        })
        let ticket = e.currentTarget.dataset.item;
        let url = this.data.baseUrl + this.data.codeSrc + ticket.orderCode
        this.setData({
            show:true,
            ticket,
            codeUrl: url

        },() => {
            wx.hideLoading();
        })
    },
    onRecord(e){
        let orderId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: './record/index?orderId=' + orderId,
        })
    },

    onGoDetail(e){
        let item = e.currentTarget.dataset.item;
        let valid = this.data.valid;
        wx.navigateTo({
            url: './ticketDetail/index?item=' + JSON.stringify(item) + '&valid=' + valid
        })
    },
    onHides() {
        this.setData({
            show: false
        })
    },
    //有效
    onValid() {
        this.setData({
            valid: true,
            invalid: false,
            type: 1,
            ticketList:[]
        })
        this._getMyTicket(1, 0);
        
    },
    //无效
    onInvalid() {
        this.setData({
            valid: false,
            invalid: true,
            type: 2,
            ticketList:[]
        })
        this._getMyTicket(2, 0);
        
    },
    //我的门票 type 1有效 2无效
    _getMyTicket(type,start){
        wx.showLoading({
            title: '加载中'
        })
        ticketModel.getMyTicket({
            type,
            start,
            limit:20
        }).then(res => {
            wx.hideLoading();
            let temArr = this.data.ticketList.concat(res.data.items)
            this.setData({
                ticketList: temArr,
                total: res.data.total
            })
        }).catch(err =>{
            wx.hideLoading();
        })
    }
})