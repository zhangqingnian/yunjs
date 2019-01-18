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
        iphone: '',
        id:''
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let item = JSON.parse(options.item);
        this.setData({
            name:item.name || '',
            iphone: item.mobile,
            id:item.id
        })
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
        this._reviseContacts()

    },
    _reviseContacts(){
        let {id,name,iphone} = this.data;
        myModel.reviseContacts({
            linkMan: id + '|' + name + '|' + iphone
        }).then(res => {
            console.log(res);
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