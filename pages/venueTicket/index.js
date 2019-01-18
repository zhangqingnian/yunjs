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
        this._getTicket(id);
    },
    //下拉刷新
    onPullDownRefresh() {
        wx.showNavigationBarLoading() //在标题栏中显示加载

        this._getTicket(this.data.id,function(){
            // complete
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
        });   
       
            
       
    },
    onShareAppMessage(Object) {

    },
    onGoDetails(e){
        let ticket = e.currentTarget.dataset.ticket;
        //ticket = JSON.stringify(ticket);
        wx.navigateTo({
            url: './venueTicketDetails/index?id='+ticket.id,
        })
    },
    _getTicket(id,cb) {
        venueModel.getTicket(id).then(res => {
            console.log(res.data.items)
            cb && cb();
            this.setData({
                ticketList: res.data.items
            })
        })
    }
})