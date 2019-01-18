// pages/my/contacts/addContacts/index.js
import {
    MyModel
} from '../../../../models/my.js';
import {
    config
} from '../../../../config.js'
let myModel = new MyModel();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        name: '',
        iphone: ''
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    onName(e) {
        let name = e.detail.value.trim();
        this.setData({
            name
        })
    },
    onIphone(e) {
        let iphone = e.detail.value.trim();
        this.setData({
            iphone
        })
    },
    onBaocun(){
        let {name, iphone} = this.data;
        if(!name || !iphone){
            wx.showToast({
                title: '请完善信息！',
                icon:'none'
            })
            return;
        }
        this._addContacts()
    },
    _addContacts(){
        let {name, iphone} = this.data;
        myModel.addContacts({
            linkMan: name + '|' + iphone + '|' + iphone
        }).then(res => {
            console.log(res);
            wx.showToast({
                title: res.data.msg,
            })
            if (res.data.success) {
                wx.navigateBack({
                    delta: 1
                })
            }
        })
    }
})