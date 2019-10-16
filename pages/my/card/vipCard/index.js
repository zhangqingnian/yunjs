// pages/my/card/vipCard/index.js
import { CardModel} from '../../../../models/card.js'
let cardModel = new CardModel();


Page({

    /**
     * 页面的初始数据
     */
    data: {
        pwdVal: '', //输入的密码
        payFocus: false, //文本框焦点
        money:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let id = options.id;
        let fileName = options.vipImg || '';
        this.setData({
            id, fileName
        })

        this._getCardNews();
    },
    /**
         * 获取焦点
         */
    getFocus: function () {
        this.setData({
            payFocus: true
        });
        console.log(this.data.payFocus)
    },
    /**
     * 输入密码监听
     */
    inputPwd: function (e) {
        let pwdVal = e.detail.value;
        this.setData({
            pwdVal
        });
        if (e.detail.value.length >= 6) {
            console.log('支付');  //支付
            this.onPay();
        }
    },
    inputMoney(e){
        let money = e.detail.value.trim();
        this.setData({
            money: e.detail.value
        });
    },
    onPay(){
        let { money, pwdVal} = this.data;
        console.log(this.data)
        if (!money){
            this.setData({
                pwdVal: ''
            })
            wx.showToast({
                title: '请输入支付金额',
                icon:'none'
            })
            return
        }

        this._pay();

    },
    _getCardNews(){
        let id = this.data.id;
        cardModel.myVipCard({
            id
        }).then(res => {
            this.setData({
                vipCard: res.data.data
            })
        })
    },
    _pay(){
        let { id, money, pwdVal} = this.data;
        wx.showLoading({
            title: '支付中',
        })
        cardModel.myVipCardPay({
            id,
            payPassword: pwdVal,
            money
        }).then(res => {
            wx.hideLoading();
            wx.showToast({
                title: res.data.msg,
                icon:'none'
            })

            if(!res.data.success){
                this.setData({
                    pwdVal: ''
                })
                return;
            }

            if(res.data.success){
                this.setData({
                    pwdVal:'',
                    money:''
                })
                this._getCardNews();
            }
            
        })
    }

})