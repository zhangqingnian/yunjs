// pages/my/suggest/index.js
import {MyModel} from '../../../models/my.js'
let myModel = new MyModel()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        val: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    onInput(e){
        let val = e.detail.value.trim();
        this.setData({
            val
        })
    },
    onSubmit(){
        let val = this.data.val;
        if(!val){
            wx.showToast({
                title: '反馈内容不能为空!',
                icon:'none'
            })
            return
        }
        this._submit(val);

    },
    _submit(content){
        myModel.suggest({
            content
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