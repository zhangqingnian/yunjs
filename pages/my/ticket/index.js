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
    onHide(){
        this.setData({
            show:false
        })
        this._getMyTicket(1, 0);
    },

    onGoDetail(e){
        let item = e.currentTarget.dataset.item;
        let valid = this.data.valid;
        wx.navigateTo({
            url: './ticketDetail/index?item=' + JSON.stringify(item) + '&valid=' + valid
        })
    },
    //有效
    onValid() {
        this.setData({
            valid: true,
            invalid: false
        })
        this._getMyTicket(1, 0);
        
    },
    //无效
    onInvalid() {
        this.setData({
            valid: false,
            invalid: true
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
            limit:10
        }).then(res => {
            wx.hideLoading();
            this.setData({
                ticketList:res.data.items
            })
            console.log(res);
        }).catch(err =>{
            wx.hideLoading();
        })
    }
})