// pages/my/jifen /index.js
import { MyModel } from '../../../models/my.js'
let myModel = new MyModel()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        more: false,
        list:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this._getJifen();
    },
    onReachBottom: function () {
        if (this.data.list.length >=  this.data.total ){
            this.setData({
                more:true
            })
            return
        }
        this._getJifen();

    },
    _getJifen(){
        myModel.getJifen().then(res => {
            let list = this.data.list.concat(res.data.items);
            this.setData({
                list,
                total:res.data.total
            })
        })
    }
})