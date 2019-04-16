// pages/my/order/index.js
import { MyOrderModel} from '../../../models/myOrder.js';

let myOrderModel = new MyOrderModel();


Page({

    /**
     * 页面的初始数据
     */
    data: {
        unpaid: false,
        paid: true,
        cancel:false,
        currentType:'',//当前那种状态的订单
        total:0,       //总数
        loading:false, //loading显示隐藏 
        orderList:[],   //结果
        isData:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let currentType = options.currentType || 100;
        this._getOrderList(currentType,0);
        this.setData({
            currentType,
        })
    },
    //待支付
    onUnpaid() {
        this.setData({
            unpaid: true,
            paid: false,
            cancel: false,
            currentType:99,
            isData: false
        })
        this._getOrderList(99, 0);
    },
    //已支付
    onPaid() {
        this.setData({
            unpaid: false,
            paid: true,
            cancel: false,
            currentType:100,
            isData: false
        })
        this._getOrderList(100, 0);
    },
    //已取消
    onCancel() {
        this.setData({
            unpaid: false,
            paid: false,
            cancel: true,
            currentType:101,
            isData: false
        })
        this._getOrderList(101, 0);
    },
    //去详情
    onGoDetail(e){
        let item = e.currentTarget.dataset.item;
        wx.navigateTo({
            url: './areaDetail/index?item='+JSON.stringify(item),
        })
    },
    //我的 xxx
    onGoOrder(e){
        let orderType = e.detail.orderType;
        if (orderType == 15) {
            wx.navigateTo({
                url: '/pages/my/area/index',
            })
        } else if (orderType == 16) {
            wx.navigateTo({
                url: '/pages/my/card/index',
            })
        } else if (orderType == 17) {
            wx.navigateTo({
                url: '/pages/my/kechen/index',
            })
        } else if (orderType == 24) {
            wx.navigateTo({
                url: '/pages/my/ticket/index',
            })
        }
    },
    //支付
    onPay(e){
        let item = e.detail;
        wx.navigateTo({
            url: './cashier/index?item='+JSON.stringify(item)
        })
    },
    //退款
    onRefund(e){
        let item = e.detail;
        if (item.orderType != 24){
            wx.showModal({
                title: '提示',
                content: '请与场馆联系退款,场馆联系电话:' + item.venueMobile,
            })
            return;
        }

        wx.showModal({
            title: '提示',
            content: '是否确定申请退款!',
            success: r => {
                if(r.confirm){
                    //门票退款
                    myOrderModel.ticketOrderRefund({
                        type: 1,
                        id: item.id
                    }).then(res => {
                        wx.showModal({
                            title: '提示',
                            content: res.data.msg,
                            showCancel:false,
                            success:r => {
                                if (r.confirm) {
                                    if (res.data.success) {
                                        this._getOrderList(100, 0);
                                    }
                                } 
                            }
                        })
                    })
                }
            }
        })
        
    },
    //再次购买
    onBuy(e){
        let id = e.detail.venueId;
        wx.navigateTo({
            url: '/pages/venueList/venueDetail/index?id='+id
        })
    },
    //删除订单
    onDel(e){
        let orderId = e.detail.id;
        let orderDifference = e.detail.orderDifference;
        
        wx.showModal({
            title: '提示',
            content: '确定删除订单?',
            success: res => {
                if (res.confirm){
                    if (orderDifference == 'MINI_ORDER') {
                        this._shareOrderDel(orderId)
                    }else{
                        this._del(orderId)
                    }
                    
                }
            }
        })
    },
    //评论
    onRating(e){
        let item = e.currentTarget.dataset.item;
        wx.navigateTo({
            url: './areaDetail/index?item=' + JSON.stringify(item)+'&showRating='+true,
        })
    },
    _del(orderId){
        myOrderModel.myOrderDel({
            status: 2,
            orderId
        }).then(res => {
            console.log(res);
            wx.showToast({
                title: res.data.msg,
            })

            if(res.data.data == 1){
                this._getOrderList(this.data.currentType, 0);
            }
            
        })
    },
    //分享订单删除
    _shareOrderDel(orderId){
        myOrderModel.shareOrderDel({
            id: orderId
        }).then(res => {
            console.log(res);
            wx.showToast({
                title: res.data.msg,
            })
            if (res.data.success) {
                this._getOrderList(this.data.currentType, 0);
            }

        })
    },
    _orderType(orderType) {
        let currentType = '';
        if (orderType == 15) {
            currentType = 'area'
        } else if (orderType == 16) {
            currentType = 'card'
        } else if (orderType == 17) {
            currentType = 'course'
        } else if (orderType == 24) {
            currentType = 'ticket'
        }
        this.setData({
            currentType
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
       
        let start = this.data.orderList.length;
        let status = this.data.currentType;
        let total = this.data.total;
        if(start >= total){
            wx.showToast({
                title: '没有数据了',
                icon:'none'
            })
            return;
        }
        this.setData({ loading: true })
        myOrderModel.myOrderList({
            status,
            limit: 20,
            start
        }).then(res => {
            this.setData({ loading: false })
            let temArr = this.data.orderList.concat(res.data.items)
            this.setData({
                orderList: temArr,
                isData: !temArr.length
            })
        })
    },
    _getOrderList(status, start){
        //status 99待支付 100已支付 101已取消
        wx.showLoading({
            title: '加载中...',
        })
        myOrderModel.myOrderList({
            status,
            start,
            limit:20
        }).then(res => {
            wx.hideLoading();
            this.setData({
                orderList:res.data.items,
                total:res.data.total,
                isData: !res.data.items.length
            })
        })
    },

    
})