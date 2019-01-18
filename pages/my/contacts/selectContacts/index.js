// pages/my/contacts/index.js
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
    
        contactsList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this._getContacts();
    },

    onSelect(e){
        let item = e.currentTarget.dataset.item;
    },
    

    _getContacts(){
        myModel.getContacts().then(res => {
            this.setData({
                contactsList:res.data.items
            })
        })
    }
})