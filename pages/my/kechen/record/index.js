// pages/my/kechen/record/index.js

import { CourseModel } from '../../../../models/course.js';
let courseModel = new CourseModel();
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
        let id = options.id;
        this.setData({
            id
        })
        this._getRecord(id)
    },
    onReachBottom(){
        let {list,total,id} = this.data;
        if(list.length >= total){
            return
        }
        this._getRecord(id)
    },
    _getRecord(myCourseId){
        courseModel.getRecord({
            myCourseId
        }).then(res => {
            let list = this.data.list.concat(res.data.items) 
            console.log(res)
            this.setData({
                list,
                total:res.data.total
            })

        })
    }
})  