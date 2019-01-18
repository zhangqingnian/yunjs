// pages/venueTicket/venueTicketDetails/index.js
import {
    config
} from '../../../config.js';
import {
    OrderModel
} from '../../../models/order.js';

let orderModel = new OrderModel();

import {
    VenueModel
} from '../../../models/venue.js';
let venueModel = new VenueModel();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: config.base_img_url,
        ticket:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let id = options.id;
        this.getTicketDetail(id)
    },
    onShareAppMessage(Object) {

    },
    //进入场馆
    onGoVenue() {
        wx.navigateTo({
            url: '/pages/venueList/venueDetail/index?id=' + this.data.ticket.venueId,
        })
    },
    onShow(){
        let _ticket = wx.getStorageSync('ticket');
        if(!_ticket)return;
        if(_ticket.ispay){
            wx.removeStorageSync('ticket')
        }else{
            this.cancelOrder(_ticket.orderCode);
        }
       
    },
    onMap(e) {
        console.log(e.currentTarget.dataset);
        let {
            name,
            address,
            lat,
            lon
        } = e.currentTarget.dataset;
        wx.getLocation({ //获取当前经纬度
            type: 'wgs84', //返回可以用于wx.openLocation的经纬度，
            success: function (res) {
                wx.openLocation({ //​使用微信内置地图查看位置。
                    latitude: Number(lat), //要去的纬度-地址
                    longitude: Number(lon), //要去的经度-地址
                    name,
                    address
                })
            }
        })
    },
    onGoOrder(e){
        let ticket = JSON.stringify(this.data.ticket);
        wx.navigateTo({
            url:'/pages/confirmOrder/ticket/index?ticket='+ticket,
        })
    },
    //取消订单
    cancelOrder(orderCode) {
        orderModel.cancelTicketOrder({
            orderCode
        }).then(res => {
            wx.removeStorageSync('ticket')
            wx.showToast({
                title: res.data.msg,
            })
        })
    },
    getTicketDetail(id){
        venueModel.getTicketDetail({
            id
        }).then(res => {
            this.setData({
                ticket:res.data.data
            })
        })
    }

})