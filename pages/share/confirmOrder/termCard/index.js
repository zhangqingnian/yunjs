// pages/confirmOrder/other/index.js
import {config} from '../../../../config.js'
import { MyModel } from '../../../../models/my.js'
import {
    CardModel
} from '../../../../models/card.js';

let cardModel = new CardModel();
let myModel = new MyModel();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentType: 'share',
        imgUrl: config.base_img_url,
        isChecked:false, //协议勾选
        card:{},        //馆卡信息
        activateDate:0,  //激活时间
        contactsList:[],    //联系人列表
        currentContacts:{}, //当前联系人
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
        let card = JSON.parse(options.card);
        card.cardName = card.cardName.replace(/\%26/g, "&");
        let activityday = options.currentTime || 0;  //激活天数
        let sortId = options.sortId;
        let money = Number(options.money);  //支付价格
        let { venueGoodsId, packageId, customerId, type } = options;
        this.setData({
            card,
            activityday,
            sortId, venueGoodsId, packageId, customerId, type,
            total:money.toFixed(2),
            discountTotal: money.toFixed(2)
        })
        
       
    },
    onShow(){
        if (!this.data.currentContacts.name) {
            this._getContacts();
        }
    },
    //勾选协议
    onCheck(e){
        this.setData({
            isChecked: !this.data.isChecked
        })
    },
    //查看协议
    onElectronicProtocol(e){
        let src = e.currentTarget.dataset.img;
        let imgSrc = config.base_img_url +src;
        wx.navigateTo({
            url: '/pages/electronicProtocol/index?imgSrc=' + imgSrc
        })
    },
    onClose(){
        this.setData({
            payShow: false
        })
    },
    //选择联系人或学员
    onGoStudentList(){
        let isBindMobile = wx.getStorageSync('isBindMobile');
        if (!isBindMobile) {
            wx.navigateTo({
                url: '/pages/bindMobile/index'
            })
            return
        }
        
        wx.navigateTo({
            url: '../selectStudent/index',
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

        if (this.data.card.electronicProtocol) {
            if (!this.data.isChecked) {
                wx.showToast({
                    title: '请确认电子协议',
                    icon: 'none'
                })
                return
            }
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
    //提交订单
    _submitOrder() {
        let money = this.data.total,  //价格
            activityday = this.data.activityday,//激活天数
            sortId = this.data.sortId, //排序id
            linkId = this.data.currentContacts.id, //联系人ID
            venueCardId = this.data.card.id,
            venueId = this.data.card.venueId;

        wx.showLoading()
        cardModel.submitShareOrder({
            sortId,     //排序商品id（分享过来的）
            money,      //订单金额
            orderType:16,  //馆卡订单 16 课程订单 17
            venueId,    //场馆主键
            venueCardId,//馆卡的主键
            linkId,     //联系人
            activityday,//馆卡激活天数   

        }).then(res => {
            wx.hideLoading()
            console.log(res)
            let reslut = res.data;
            if (reslut.code == 'JUMP_NEW_PRICE') {
                wx.showModal({
                    title: '提示',
                    content: '当前优惠已改变，请按照新的优惠价格购买',
                    showCancel: false,
                    success: (r) => {
                        this._getCardDetail()
                    }
                })
                return;
            }

            if (reslut.code == 'JUMP_USER_APPLET') {
                wx.showModal({
                    title: '提示',
                    content: reslut.msg,
                    showCancel: false,
                    success: (r) => {
                        if (r.confirm) {
                            wx.navigateTo({
                                url: '/pages/venueCard/venueCardDetails/index?id=' + venueCardId,
                            })
                        }
                    }
                })
                return;
            }
            if (!reslut.success) {
                wx.showModal({
                    title: '提示 ',
                    content: reslut.msg,
                    showCancel: false
                })
                return
            }
            wx.showToast({
                title: reslut.msg,
                duration: 500,
                complete: () => {
                    if (reslut.success && reslut.data) {
                        this.setData({
                            orderCode: reslut.data.orderCode,
                            payShow: true           //显示支付层
                        })
                    }
                }
            })

        })
    },
   
    //获取学员
    _getContacts() {
        wx.showLoading()
        myModel.getStudentInfo({
            start: 0,
            limit: 20
        }).then(res => {
            wx.hideLoading()
            let contactsList = res.data.items;
            let currentContacts = contactsList[0] || {};

            this.setData({
                contactsList,    //联系人列表
                currentContacts //当前联系人
            })
        })
    },
    _getCardDetail() {
        let { sortId, venueGoodsId, packageId, customerId, type } = this.data
        cardModel.getCardsDetail({
            venueGoodsId,
            id: sortId,
            packageId,
            customerId,
            type
        }).then(res => {
            let money = Number(res.data.data.salePrice);
            this.setData({
                total: money.toFixed(2),
                discountTotal: money.toFixed(2)
            })

        })
    }
})