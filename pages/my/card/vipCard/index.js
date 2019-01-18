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
        this.setData({
            id
        })

        this._getCardNews(id);
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
        console.log(e.detail.value)
        this.setData({
            pwdVal: e.detail.value
        });
        // if (e.detail.value.length >= 6) {
        //     console.log(e.detail.value);  //支付

        // }
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
            wx.showToast({
                title: '请输入支付金额',
                icon:'none'
            })
            return
        }

        if (!pwdVal) {
            wx.showToast({
                title: '请输入密码',
                icon: 'none'
            })
            return
        }
        this._pay();

    },
    _getCardNews(id){
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

            if(res.data.success){
                this.setData({
                    money: '',
                    pwdVal: ''
                })
            }
            
        })
    }

})