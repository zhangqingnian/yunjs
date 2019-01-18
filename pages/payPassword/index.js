// pages/payPassword/index.js
import { config } from '../../config.js'


import {
    MyModel
} from '../../models/my.js';
import {
    QuestModel
} from '../../models/quest.js';
let myModel = new MyModel();
let questModel = new QuestModel();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mobile:'',
        paw: '',
        pawtwo:'',
        code: '',
        msg: '获取验证码',
        currentTime: 60,
        isOn:true
    },
    onLoad(){
        this._getInfo();
    },
    onInput(e){
        let paw = e.detail.value.trim();
        this.setData({
            paw
        })
    },
    onTwoInput(e){
        let pawtwo = e.detail.value.trim();
        this.setData({
            pawtwo
        })
    },
    //获取验证码
    onGetCode() {
        let { currentTime, paw, pawtwo, isOn }= this.data;
        if (!isOn) return;
        if (!paw || !pawtwo){
            wx.showToast({
                title: '请输入密码',
                icon:'none'
            })
            return
        }

        if(paw != pawtwo){
            wx.showToast({
                title: '两次输入的密码不相同',
                icon: 'none'
            })
            return
        }
        this._getCode();
        this.setData({
            isOn:false,
            msg: currentTime +'s'
        })
        let interval = setInterval(() => {
            this.setData({
                msg: (currentTime - 1) + 's',
            })
            currentTime--;
            if (currentTime <= 0) {
                clearInterval(interval)
                this.setData({
                    msg:'获取验证码',
                    currentTime: 60,
                    isOn: true
                })
            }
        }, 1000)

        
    },
    //输入验证码
    onCodeInput(e){
        this.setData({
            mobileCode : e.detail.value.trim()
        })
    },
    //确认修改
    onRevise() {
        let { mobileCode} = this.data;
        if(!mobileCode){
            wx.showToast({
                title: '请输入验证码',
            })
            return
        }
        this._revisePayPassword();
    },
   
    _getCode() {
        let { mobile } = this.data;
        questModel.getCode({
            types:2,
            mobile
        }).then(res => {
            wx.showToast({
                title: res.data.msg
            })
        })
    },
    _getInfo(){
        myModel.getMyInfo().then(res => {
            if (res.data.success) {
                let reslut = res.data.data;
                this.setData({
                    mobile: reslut.mobile
                })
            }    
        })
    },
    _revisePayPassword(){
        let { paw, pawtwo, mobileCode } = this.data;
        questModel.revisePayPassword({
            newPwd:paw,
            newPwdRe:pawtwo,
            mobileCode
        }).then(res => {
            console.log(res)
            wx.showToast({
                title: res.data.msg,
            })

            if(res.data.success){
                wx.navigateBack({
                    delta:1
                })
            }
        })
    }
})