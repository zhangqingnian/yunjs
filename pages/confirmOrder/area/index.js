// pages/confirmOrder/other/index.js
import { config } from '../../../config.js'
import { MyModel } from '../../../models/my.js'
import {
    CouponModel
} from '../../../models/coupon.js';
import {
    OrderModel
} from '../../../models/order.js';

let couponModel = new CouponModel();
let orderModel = new OrderModel();
let myModel = new MyModel();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentType: 'area',
        imgUrl: config.base_img_url,
        isChecked: false, //协议勾选
        area:{},        //场地信息
        venue:{},      //场馆信息
        contactsList: [],    //联系人列表
        currentContacts: {}, //当前联系人
        payShow: false,     //是否显示支付组件
        isCoupon: false,    //是否显示优惠券组件
        total: 0,          //总价
        discountTotal: 0,  //优惠后的总价
        coupon: {},        //选中的优惠券  
        couponLen: 0,     //优惠券数量
        couponList: [],   //优惠券列表
        orderCode: '',    //订单号
        ispay: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let area = JSON.parse(options.arr);
        let venue= JSON.parse(options.venue);
        let sportName = options.sportName;
        let sportTypeId = Number(options.sportTypeId);
        let total = 0;
        area.forEach(item =>  {
            total += item.cvaoPrice
        })
        this.setData({
            area,
            venue,
            sportName,
            sportTypeId,
            total: total.toFixed(2),
            discountTotal: total.toFixed(2)
        })

        this._getContacts();

        //let id = card.sportId || '';  //会员卡是不用传
        //this._getCouponList(id)
    },
    //勾选协议
    onCheck(e) {
        this.setData({
            isChecked: !this.data.isChecked
        })
    },
    //查看协议
    onElectronicProtocol(e) {
        let src = e.currentTarget.dataset.img;
        let imgSrc = config.base_img_url + src;
        wx.navigateTo({
            url: '/pages/electronicProtocol/index?imgSrc=' + imgSrc
        })
    },
    onClose() {
        this.setData({
            payShow: false
        })
    },
    //选择联系人或学员
    onGoStudentList() {
        let contactsList = JSON.stringify(this.data.contactsList)
        wx.navigateTo({
            url: '../selectContacts/index?contactsList=' + contactsList,
        })
    },


    //提交订单
    onSubmit() {
        if (JSON.stringify(this.data.currentContacts) == '{}') {
            wx.showToast({
                title: '请先选择联系人！',
                icon: 'none'
            })
            return
        }
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
    //跳转优惠券列表
    onGoCoupon() {
        this.setData({
            isCoupon: true
        })
    },
    //监听选中的优惠券
    onCouponBack(e) {
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
    _getCouponList(sportTypeId) {
        couponModel.getMyCoupon({
            type: 4,
            sportId: sportTypeId,
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
                if ((this.data.total >= item.consume) && (this.data.card.type == item.venueCardsType)) {
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
        console.log(reslut)
    },
    //提交订单
    _submitOrder() {
        let couponSubId = this.data.coupon.couponId || '', //优惠券id
            linkMan = this.data.currentContacts.id,
            venueObjectId = this.data.venue.id;
        let venueAreaOpentimeId = [];
        wx.showLoading()
        this.data.area.forEach(item => {
            venueAreaOpentimeId.push(item.id)
        })    
        orderModel.submitAreaOrder({
            venueObjectId,          //场馆Id
            venueAreaOpentimeId,  //场地ID Arr   
            couponSubId,           //优惠券Id
            linkMan,         //联系人ID
        }).then(res => {
            wx.hideLoading()
            console.log(res)
            let reslut = res.data;
            wx.showToast({
                title: reslut.msg,
                duration: 1000,
                complete: () => {
                    if (reslut.success && reslut.data) {
                        this.setData({
                            orderCode: reslut.data,
                            payShow: true           //显示支付层
                        })
                    }
                }
            })

        })
    },
    //取消订单
    _cancel() {
        let orderCode = this.data.orderCode;
        if (!orderCode) return;
        orderModel.cancelOrder({
            orderCode
        }).then(res => {
            console.log(res)
            let reslut = res.data;
            wx.showToast({
                title: reslut.msg,
            })

        })
    },
    //获取联系人
    _getContacts() {
        wx.showLoading()
        myModel.myContacts({
            start: 0,
            limit: 20
        }).then(res => {
            wx.hideLoading();
            let contactsList = res.data.items;
            let currentContacts = contactsList[0] || {}
            contactsList.forEach(item => {
                if (item.status == 1) {
                    currentContacts = item;
                    return
                }
            })
            this.setData({
                contactsList,    //联系人列表
                currentContacts //当前联系人
            })
        })
    }
})