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
        ticketList:[],
        id:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let id = options.id;
        this.setData({id})
        let start = this.data.ticketList.length;
        this._getTicket(id, start);
    },
    onShareAppMessage(Object) {

    },
    onReachBottom(){
        let start = this.data.ticketList.length;
        let total = this.data.total;
        let id = this.data.id;
        if (start >= total) return;
        this._getTicket(id, start)
    },
    onGoDetails(e){
        let ticket = e.currentTarget.dataset.ticket;
        //ticket = JSON.stringify(ticket);
        wx.navigateTo({
            url: './venueTicketDetails/index?id='+ticket.id,
        })
    },
    _getTicket(id,start) {
        wx.showLoading()
        venueModel.getTicket({
                venueId: id,
                type:1,
                start,
                limit:20
            }).then(res => {
                wx.hideLoading()
                let temArr = res.data.items.concat(this.data.ticketList)
                this.setData({
                    ticketList: temArr,
                    total: res.data.total
                })
        })
    }
})