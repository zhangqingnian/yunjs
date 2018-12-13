// pages/venueTicket/index.js
import {
    config
} from '../../config.js';
import {
    VenueModel
} from '../../models/venue.js';
let venueModel = new VenueModel();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: config.base_img_url,
        ticketList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let id = options.id;
        this._getTicket(id);
    },
    onGoDetails(e){
        let ticket = e.currentTarget.dataset.ticket;
        ticket = JSON.stringify(ticket);
        wx.navigateTo({
            url: './venueTicketDetails/index?ticket='+ticket,
        })
    },
    _getTicket(id) {
        venueModel.getTicket(id).then(res => {
            console.log(res.data.items)
            this.setData({
                ticketList: res.data.items
            })
        })
    }
})