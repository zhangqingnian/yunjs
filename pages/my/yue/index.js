import {
    MyModel
} from '../../../models/my.js';
let myModel = new MyModel();


Page({

    /**
     * 页面的初始数据
     */
    data: {
        more: false,
        list:[]
    },

    onLoad: function(options) {
        this.yueRecord(0);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        let {list , total} = this.data;
        if(list.length >= total){
            this.setData({more:true})
            return
        }
        this.yueRecord(list.length)
    },
    yueRecord(start) {
        myModel.yueRecord({
            start,
            limit: 20
        }).then(res => {
            console.log(res)
            let list = this.data.list.concat(res.data.items)
            this.setData({
                list,
                total:res.data.total
            })
        })
    }


})