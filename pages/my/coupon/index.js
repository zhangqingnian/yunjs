// pages/my/coupon/index.js
import {
    CouponModel
} from '../../../models/coupon.js';
let couponModel = new CouponModel();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        couponList: [],
        show: false,
        exchangeCode: '',
        nav: [
            {
                id: 1,
                name: '未使用',
                isOn: true
            }, {
                id: 2,
                name: '已使用',
                isOn: false
            }, {
                id: 3,
                name: '已过期',
                isOn: false
            }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this._getMyCouponList(1);
    },
    //选择类型 未使用 已使用 已过期
    onSelectType(e){
        let id = e.currentTarget.dataset.id;
        this.data.nav.forEach(item => {
            if(item.id == id){
                item.isOn = true;
                this._getMyCouponList(item.id);
            }else{
                item.isOn = false;
            }
        })
        this.setData({
            nav:this.data.nav
        })
    },
  
    
    //输入兑换码
    onInput(e) {
        let exchangeCode = e.detail.value.trim();
        this.setData({
            exchangeCode
        })
    },
    
    //确定兑换
    confirmExchange() {
        if (!this.data.exchangeCode) {
            wx.showToast({
                title: '请输入兑换码',
                icon: 'none'
            })
            return;
        }
        this._exchangeCoupon()
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },
    //获取我的优惠券type 1:未使用 2：已使用 3：已过期
    _getMyCouponList(type) {
        wx.showLoading({
            title: '玩命加载中'
        })
        couponModel.getMyCouponList({
            type,
            strat: 0,
            limit: 10
        }).then(res => {
            console.log(res.data.items);
            wx.hideLoading();
            this.setData({
                couponList: res.data.items
            })
        }).catch(e => {
            wx.hideLoading();
        })
    },
    _exchangeCoupon(){
        let customerCode = this.data.exchangeCode;
        couponModel.exchangeCoupon({
            customerCode
        }).then(res =>{
            this.setData({
                exchangeCode:""
            })
            wx.showToast({
                title: res.data.msg,
            })
            if(res.data.success){
                this._getMyCouponList(1);
                this.data.nav.forEach(item => {
                    if(item.id == 1){
                        item.isOn = true;
                    }else{
                        item.isOn = false;
                    }
                })
                this.setData({
                    nav: this.data.nav
                })
            }
        })
    }

})