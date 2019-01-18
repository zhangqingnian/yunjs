// pages/confirmOrder/selectContacts/index.js
import { MyModel } from '../../../models/my.js';
let myModel = new MyModel();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this._getContacts()
    },
    //新增加联系人
    onAdd(){
        wx.navigateTo({
            url: '/pages/my/contacts/addContacts/index'
        })
    },
    onShow(){
        this._getContacts()
    },
    onSelect(e) {
        let item = e.currentTarget.dataset.item;
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        prevPage.setData({
            currentContacts: item,
        })
        wx.navigateBack({
            delta: 1,
        });
    },
    //获取联系人
    _getContacts() {
        wx.showLoading()
        myModel.getContacts({
            start: 0,
            limit: 20
        }).then(res => {
            wx.hideLoading()
            let list = res.data.items;
            this.setData({
                list    //联系人列表
            })
        })
    }
})