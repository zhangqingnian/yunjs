// pages/my/kechen/record/index.js

import { TicketModel } from '../../../../models/ticket.js'

let ticketModel = new TicketModel();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let orderId = options.orderId;
        this.setData({
            orderId
        })
        this._getRecord(orderId)
    },
    _getRecord(orderId){
        ticketModel.myTickeTime({
            orderId
        }).then(res => {
            let list = res.data.data.entranceticketVos || [];
            console.log(list)
            this.setData({
                list
            })

        })
    }
})  