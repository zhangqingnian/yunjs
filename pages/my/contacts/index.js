// pages/my/contacts/index.js
import { MyModel } from '../../../models/my.js';
let myModel = new MyModel();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list:[],
        arr: [
            { username: '大飞囊', iphone: '17777777771', isDefault: true, id: 1 },
            { username: '小海疼', iphone: '15987989719', isDefault: false, id: 23 },
            { username: '发福蝶', iphone: '13788948579', isDefault: false, id: 44 }
        ],
        imgSrc: '/images/my/icon_9.png',
        onImgSrc: '/images/my/icon_10.png'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
    },
    onShow(){
        this._myContacts();
    },
    onSelectDefault(e) {
        let id = e.currentTarget.dataset.id;
        let oldArr = this.data.list;
        let newArr = oldArr.map(item => {

            if (item.id == id) {
                item.status = true;
                this._setDefulatContacts(id);
            } else {
                item.status = false;
            }

            return item
        });
        this.setData({
            list: newArr
        })
    },
    onRevise(e){
        let item = e.currentTarget.dataset.item;
        wx.navigateTo({
            url: './reviseContacts/index?item='+JSON.stringify(item),
        })
    },
    onDelete(e){
        let item = e.currentTarget.dataset.item;
        this._deleteContacts(item.id);
    },
    onAdd(){
        wx.navigateTo({
            url: './addContacts/index',
        })
    },
    _myContacts(){
        myModel.myContacts({
            start:0,
            limit:10
        }).then(res =>{
            console.log(res)
            this.setData({
                list: res.data.items
            })
        })
    },
    _setDefulatContacts(id){
        myModel.setDefulatContacts({
            status:1,
            id
        }).then(res =>{
            wx.showToast({
                title: res.data.msg,
            })
        })
    },
    _deleteContacts(id){
        wx.showLoading()
        myModel.deleteContacts({
            status:2,
            id
        }).then(res => {
            console.log(res)
            wx.hideLoading();
            wx.showToast({
                title: res.data.msg,
            })
            if(res.data.success){
                this._myContacts();
            }
        })
    }
})