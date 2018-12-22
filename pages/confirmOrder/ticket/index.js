// pages/confirmOrder/ticket/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isCoupon:false,
        ticketNum:1,
        ticket:{},
        total:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        
        let ticket = JSON.parse(options.ticket);
        console.log(ticket)
        
        this.setData({
            ticket,
            total: ticket.ticketPrice
        })
    },
    onAdd(){
        if (this.data.ticketNum < this.data.ticket.ticketBuylimitAmount){
            this.setData({
                ticketNum: this.data.ticketNum + 1,
                total: (this.data.ticketNum + 1) * this.data.ticket.ticketPrice
            })
        }else{
            wx.showToast({
                title: '已到最大限购数量',
                icon:'none',
                duration:1000
            })
        }
        
    },
    onReduce(){
        if (this.data.ticketNum>1){
            this.setData({
                ticketNum: this.data.ticketNum - 1,
                total: (this.data.ticketNum - 1) * this.data.ticket.ticketPrice
            })
        }
       
    },
    onSubmit() {
        this.setData({
            payShow: true
        })
    },
    onClose() {
        this.setData({
            payShow: false
        })
    },
    //优惠券列表
    onGoCoupon(){
        console.log(1);
        this.setData({
            isCoupon:true
        })
    }

    
})