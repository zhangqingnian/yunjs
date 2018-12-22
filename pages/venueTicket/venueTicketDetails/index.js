// pages/venueTicket/venueTicketDetails/index.js
import {
    config
} from '../../../config.js';
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
        //174 162
        let ticket = JSON.parse(options.ticket);
        console.log(ticket)
        this.setData({
            ticket
        })
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
    }
})