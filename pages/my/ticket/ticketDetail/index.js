// pages/my/ticket/ticketDetail/index.js
import {
    config
} from '../../../../config.js';
import { TicketModel } from '../../../../models/ticket.js'

let ticketModel = new TicketModel();


Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: config.base_img_url,
        baseUrl: config.api_base_url,
        ticket: {},
        valid: false,//是否有效
        show: false, 
        codeSrc: "m/crm/venueOrder/front/getVerificationCode?orderCode=",
        codeUrl:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let ticket =JSON.parse(options.item);
        let valid = options.valid === 'true' ? true : false;
        this.setData({
            ticket,
            valid
        })
    },
    onHide(){
        this.setData({
            show: false
        })
    },
    onUse(e){
        wx.showLoading({
            title: '加载中',
        })
       
        let orderCode = this.data.ticket.orderCode;
        let url = this.data.baseUrl + this.data.codeSrc + orderCode
        this.setData({
            show: true,
            codeUrl:url
        },() => {
            wx.hideLoading();
        })

    }   
  
})