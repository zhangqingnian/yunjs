// components/pay/index.js
import {
    OrderModel
} from '../../models/order.js';

let orderModel = new OrderModel();

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        orderCode:String,    //订单号
        totalFee:Number,
        body:String,
        couponId:Number,
        currentType:String  //当前类型 门票/课程...

    },

    /**
     * 组件的初始数据
     */
    data: {
        showPayPwdInput: false, //是否展示密码输入层
        pwdVal: '', //输入的密码
        payFocus: true, //文本框焦点
        currentPayType: '微信支付',
        playlist: [{
                name: '微信支付',
                isOn: true,
                src: '/images/venuedetail/icon_wx.png'
            },
            {
                name: '余额支付',
                isOn: false,
                src: '/images/venuedetail/icon_yue.png'
            }
        ],
        onSrc: '/images/on.png',
        offSrc: '/images/off.png',
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onSelectPlay(e){
            let name = e.currentTarget.dataset.name;
            this.data.playlist.forEach(item => {
                if(item.name == name){
                    if(item.isOn)return;
                    item.isOn = true;
                }else{
                    item.isOn = false;
                }
            })
            this.setData({
                playlist:this.data.playlist,
                currentPayType: name
            })
        },
        onPay(){
            let currentPayType = this.data.currentPayType;
            let orderCode = this.properties.orderCode;
            if (!orderCode)return;

            if (!currentPayType){
                wx.showToast({
                    title: '请先选择支付方式',
                    icon:'none',
                    duration:1000
                })
                return
            }
            if (currentPayType == '微信支付'){
                this.wxPay()
            }

            if (currentPayType == '余额支付') {
                this.setData({
                    showPayPwdInput:true
                })
            }

        },
        onClose(){
            this._close();
            //取消订单
            let { orderCode } = this.properties;
            this.cancelOrder(orderCode)
            
        },
        //关闭支付方式组件
        _close(){
            this.triggerEvent('close', {}, {})
        },
        /**
       * 显示支付密码输入层
       */
        showInputLayer: function () {
            this.setData({
                showPayPwdInput: true,
                payFocus: true
            });
        },
        /**
         * 隐藏支付密码输入层
         */
        hidePayLayer: function () { 
            
            var val = this.data.pwdVal;
            this.setData({
                showPayPwdInput: false,
                payFocus: false,
                pwdVal: ''
            });

        },
        /**
         * 获取焦点
         */
        getFocus: function () {
            this.setData({
                payFocus: true
            });
        },
        /**
         * 输入密码监听
         */
        inputPwd: function (e) {
            this.setData({
                pwdVal: e.detail.value
            });
            if (e.detail.value.length >= 6) {
                this.hidePayLayer(); //隐藏键盘
                this.pay(e.detail.value);  //支付
               
            }
        },
        //余额支付
        pay(payPassword){
            
            let { orderCode, currentType} = this.properties;
            wx.showLoading({  //显示loading
                title: '支付中'
            })
            //门票
            if (currentType == 'ticket') {
                this._payTicket(payPassword, orderCode)
            } else if (currentType == 'card'){
                this._payCard(payPassword, orderCode)
            } else if (currentType == 'course'){
                this._payCourse(payPassword, orderCode)
            } else if (currentType == 'area'){
                this._payArea(payPassword, orderCode)
            }


            
        },
        //微信支付
        wxPay(){
            let { currentType } = this.properties;
            wx.showLoading({
                title: '支付中',
            })
            //门票
            this._wxpayTicket()
            

            
        },
        //取消订单
        cancelOrder(orderCode){
            let { currentType } = this.properties;
            if (currentType == 'ticket') {
                this._cancelTicketOrder(orderCode)
            }
        },
        //去修改支付密码
        _goRevise(){
            wx.navigateTo({
                url: '/pages/payPassword/index',
            })
        },
        //支付成功后 存订单信息 后退页面删除订单
        _keepOrder() {
            let { orderCode, currentType } = this.properties;
            if (currentType == 'ticket'){
                let _ticket = wx.getStorageSync(this.properties.currentType);
                if(!_ticket) return;
                _ticket.ispay = true;
                wx.setStorageSync(this.properties.currentType, _ticket);
            }        
        },
        /*余额支付*/

        //门票余额支付
        _payTicket(payPassword, orderCode){
            orderModel.yePayTicket({
                orderCode,       //订单号
                payPassword  //支付密码
            }).then(res => {
               this._payafter(res);
            })
        },
        //馆卡余额支付
        _payCard(payPassword, orderCode){
            orderModel.yePayCard({
                orderno:orderCode,       //订单号
                payPassword  //支付密码
            }).then(res => {
                this._payafter(res);
            })
        },
        //课程余额支付
        _payCourse(payPassword, orderCode){
            orderModel.yePayCourse({
                orderno: orderCode,       //订单号
                payPassword  //支付密码
            }).then(res => {
                this._payafter(res);
            })
        },
        //场地余额支付
        _payArea(payPassword, orderCode) {
            orderModel.yePayArea({
                orderno: orderCode,       //订单号
                payPassword  //支付密码
            }).then(res => {
                this._payafter(res);
            })
        },

        //余额支付后 callback
        _payafter(res){
            wx.hideLoading(); //关闭loading
            console.log(res)
            wx.showModal({
                title: '提示',
                content: res.data.msg,
                showCancel: false,
                success: reslut => {
                    //余额不足 充值 //跳转充值
                    // if (res.data.code == "NOT_ENOUGH"){
                    // }

                    //未设置支付密码 -- 设置/重置支付密码
                    if (res.data.code == "account_pay_pwd_null") {
                        this._goRevise();
                        return;
                    }

                    //支付成功 跳 -- 我的订单
                    if (res.data.success) {
                        this._keepOrder();
                        wx.navigateTo({
                            url: '/pages/my/order/index?currentType=100', //currentType=100 已支付
                        })
                    }
                }
            })
        },

        /*微信支付*/
        //门票微信支付
        _wxpayTicket(){
            let { totalFee, body, orderCode, couponId } = this.properties;
            orderModel.wxPayTicket({
                totalFee: totalFee,     //金额
                tradeType: "JSAPI",        //小程序支付方式
                body: body,         //标题 (商品名)
                orderNum: orderCode,     //订单号
                couponSubId: couponId || '' //优惠券
            }).then(res => {
                this._wxpayafter(res);
            })
        },
        //微信支付后 callback
        _wxpayafter(res){
            console.log(res.data);
            let reslut = res.data.data;
            if(!res.data.success){
                wx.hideLoading();
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                })
                return
            }
            
            if (reslut.return_code == "SUCCESS" && reslut.result_code == "SUCCESS") {
                wx.requestPayment({
                    timeStamp: reslut.timestamp,
                    nonceStr: reslut.nonce_str,
                    package: 'prepay_id=' + reslut.prepay_id,
                    signType: 'MD5',
                    paySign: reslut.paySign,
                    success: r => {
                        if (r.errMsg == "requestPayment:ok") {
                            this._keepOrder()
                            //跳我的订单
                            wx.navigateTo({
                                url: '/pages/my/order/index?currentType=100', 
                                //currentType=100 已支付
                            })
                        }
                        console.log(r);
                    },
                    complete(r) {
                        wx.hideLoading();
                    },
                    fail(r) {
                        if (r.errMsg == "requestPayment:fail cancel") {
                            wx.showToast({
                                title: '支付已取消'
                            })
                        } else {
                            wx.showToast({
                                title: '支付失败',
                                icon: 'none'
                            })
                        }
                    }
                })
            }
        },

        /*取消订单*/
        //门票
        _cancelTicketOrder(orderCode){
            orderModel.cancelTicketOrder({
                orderCode
            }).then(res => {
                wx.removeStorageSync(this.properties.currentType)
                wx.showToast({
                    title: res.data.msg,
                })
            })
        }
    }
})