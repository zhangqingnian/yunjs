// pages/my/student/index.js

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

    },
    onShow:function(){
        this._getStudentInfo()
    },
    
    //修改
    onRevise(e){
        let item = e.currentTarget.dataset.item;
        wx.navigateTo({
            url: './reviseStudent/index?id='+item.id
        })
    },
    //删除
    onDelete(e){
        let item = e.currentTarget.dataset.item;
        myModel.deleteStudentInfo({
            id:item.id
        }).then(res => {
            wx.showToast({
                title: res.data.msg
            })
            this._getStudentInfo()
        })
    },
    //去增加学员页面
    addStudent() {
        wx.navigateTo({
            url: './addStudent/index',
        })
    },
    _getStudentInfo(){
        myModel.getStudentInfo().then(res => {
            console.log(res)
            this.setData({
                list: res.data.items
            })
        })
    }


})