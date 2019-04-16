// pages/confirmOrder/other/index.js
import { config } from '../../../../config.js';
import { MyModel } from '../../../../models/my.js';
import {
    CardModel
} from '../../../../models/card.js';
import {
    OrderModel
} from '../../../../models/order.js';

let cardModel = new CardModel();
let orderModel = new OrderModel();
let myModel = new MyModel();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentType: 'share',
        imgUrl: config.base_img_url,
        isChecked: false, //协议勾选
        card: {},        //课程信息
        classes:{},       //班级信息
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
        let card = JSON.parse(options.course);  //课程
        let classes = JSON.parse(options.classes); //班级
        let sortId = options.sortId;
        let money = Number(options.money)
        console.log(card)
        console.log(classes)
        this.setData({
            card,
            classes,
            sortId,
            total: money.toFixed(2),
            discountTotal: money.toFixed(2)
        })

       
    },
    onShow(){
        this._getContacts();
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
        let isBindMobile = wx.getStorageSync('isBindMobile');
        if (!isBindMobile) {
            wx.navigateTo({
                url: '/pages/bindMobile/index'
            })
            return
        }
        
        wx.navigateTo({
            url: '../selectStudent/index?contactsList'
        })
    },
    //提交订单
    onSubmit() {
        

        if (JSON.stringify(this.data.currentContacts) == '{}'){
            wx.showToast({
                title: '请先选择学员！',
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
        if (!isBindMobile){
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
        // let buyMoney = this.data.total,  //价格
        //     cpId = this.data.coupon.couponId || '', //优惠券id
        //     lmId = this.data.currentContacts.id;    //联系人Id
        // let {  isChecked, discountTotal } = this.data;
        let money = this.data.total,  //价格
            sortId = this.data.sortId, //排序id
            linkId = this.data.currentContacts.id, //联系人ID
            venueId = this.data.card.venueId,
            classId = this.data.classes.id;
        wx.showLoading()
        cardModel.submitShareOrder({
            sortId,
            money,
            orderType:17,
            venueId,
            classId,
            linkId,
            
        }).then(res => {
            wx.hideLoading()
            console.log(res)
            let reslut = res.data;
            if (reslut.code == 'JUMP_USER_APPLET') {
                wx.showModal({
                    title: '提示',
                    content: reslut.msg,
                    showCancel:false,
                    success:(r) => {
                        if (r.confirm) {
                            wx.navigateTo({
                                url: '/pages/kechen/kechenDetails/index?id=' + classId,
                            })
                        } 
                    }
                })
                return;
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
    }
})