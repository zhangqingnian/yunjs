// pages/confirmOrder/ticket/index.js
import {
    CouponModel
} from '../../../models/coupon.js';
import {
    OrderModel
} from '../../../models/order.js';

let couponModel = new CouponModel();
let orderModel = new OrderModel();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentType:'ticket',
        payShow:false,     //是否显示支付组件
        isCoupon:false,    //是否显示优惠券组件
        ticketNum:1,       //数量
        ticket:{},         //门票
        total:0,          //总价
        discountTotal:0,  //优惠后的总价
        coupon:{},        //选中的优惠券  
        couponLen:0,     //优惠券数量
        couponList:[],   //优惠券列表
        orderCode:'',    //订单号
        ispay:false
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let ticket = JSON.parse(options.ticket);
        console.log(ticket)
        
        this.setData({
            ticket,
            total: ticket.ticketPrice.toFixed(2),
            discountTotal: ticket.ticketPrice.toFixed(2)
        })
        this._getCouponList(ticket.id, ticket.sportTypeId)
    },
    //加
    onAdd(){
        if (this.data.ticketNum < this.data.ticket.ticketBuylimitAmount){
            this.setData({
                ticketNum: this.data.ticketNum + 1,
                total: ((this.data.ticketNum + 1) * this.data.ticket.ticketPrice).toFixed(2),
                discountTotal: ((this.data.ticketNum + 1) * this.data.ticket.ticketPrice).toFixed(2)
            })
        }else{
            wx.showToast({
                title: '已到最大限购数量',
                icon:'none',
                duration:1000
            })
        }
        
    },
    //减
    onReduce(){
        if (this.data.ticketNum>1){
            this.setData({
                ticketNum: this.data.ticketNum - 1,
                total: ((this.data.ticketNum - 1) * this.data.ticket.ticketPrice).toFixed(2),
                discountTotal: ((this.data.ticketNum - 1) * this.data.ticket.ticketPrice).toFixed(2),
            })
        }
       
    },
    //提交订单
    onSubmit() {
        let isBindMobile = wx.getStorageSync('isBindMobile');
        if (!isBindMobile) {
            wx.navigateTo({
                url: '/pages/bindMobile/index'
            })
            return
        }
        this._submitOrder();
    },
    //关闭支付方式
    onClose() {
        this.setData({
            payShow: false
        })
    },
    //优惠券列表
    onGoCoupon(){
        this.setData({
            isCoupon:true
        })
    },
    //监听选中的优惠券
    onCouponBack(e){
        let coupon = e.detail;
        console.log(coupon)
        if (!coupon.money) {
            this.setData({
                isCoupon: false
            })
            return
        }
        let discountTotal = (this.data.total - coupon.money).toFixed(2);
        this.setData({
            isCoupon: false,
            coupon,
            discountTotal,
        })
    },
    //获取优惠券列表
    _getCouponList(id, sportTypeId) {
        couponModel.getMyCoupon({
            type: 3,
            sportId: sportTypeId,
            id
        }).then(res => {
            let reslut = res.data.data;
            this._dataHandle(reslut);
        })
    },
    //数据过滤  isUse 是否可用
    _dataHandle(reslut) {
        reslut.forEach(item => {
            //满减
            if (item.couponType == 0) {
                if (this.data.total >= item.consume) {
                    item.isUse = true
                } else {
                    item.isUse = false
                }
            }
            //直接抵扣
            if (item.couponType == 1) {
                item.isUse = true
            }
        })

        this.setData({
            couponLen: reslut.length,
            couponList: reslut
        })
    },
    //提交订单
    _submitOrder(){
        let buyMoney = this.data.total,  //价格
            couponId = this.data.coupon.couponId || '', //优惠券id
            VenueEntranceticket = this.data.ticket.id,  //门票ID
            entranceAmount = this.data.ticketNum        //门票数量   
        if (entranceAmount >= 2){
            wx.showModal({
                title: '提示',
                content: '购买多张门票不可退款',
                showCancel:false,
                success:res => {
                    if(res.confirm){
                        wx.showLoading()
                        orderModel.submitTicketOrder({
                            buyMoney,
                            couponId,
                            VenueEntranceticket,
                            entranceAmount,
                        }).then(res => {
                            wx.hideLoading()
                            console.log(res)
                            let reslut = res.data;
                            wx.showToast({
                                title: reslut.msg,
                                duration: 500,
                                complete: () => {
                                    if (reslut.success && reslut.data) {
                                        wx.setStorageSync('ticket', {
                                            ispay: false,
                                            orderCode: reslut.data
                                        })
                                        this.setData({
                                            orderCode: reslut.data,
                                            payShow: true           //显示支付层
                                        })
                                    }
                                }
                            })

                        })
                    }
                }
            })
        }else{
            wx.showLoading()
            orderModel.submitTicketOrder({
                buyMoney,
                couponId,
                VenueEntranceticket,
                entranceAmount,
            }).then(res => {
                wx.hideLoading()
                console.log(res)
                let reslut = res.data;
                
                wx.showToast({
                    title: reslut.msg,
                    duration: 500,
                    complete: () => {
                        if (reslut.success && reslut.data) {
                            wx.setStorageSync('ticket', {
                                ispay: false,
                                orderCode: reslut.data
                            })
                            this.setData({
                                orderCode: reslut.data,
                                payShow: true           //显示支付层
                            })
                        }
                    }
                })

            })
        }    
        
    },
    //取消订单
    _cancel(){
        let orderCode = this.data.orderCode;
        if (!orderCode)return;
        orderModel.cancelOrder({
            orderCode
        }).then(res => {
            console.log(res)
            let reslut = res.data;
            wx.showToast({
                title: reslut.msg,
            })
            
        })
    }

    
})