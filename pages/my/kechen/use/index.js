// pages/my/kechen/use/index.js
import { config } from '../../../../config.js'
import { CourseModel } from '../../../../models/course.js'

let courseModel = new CourseModel();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        baseUrl: config.api_base_url,
        imgUrl: config.base_img_url,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let id = Number(options.id);
        this.setData({
            id
        })
        this._getCode(id,0);
    },


    onPullDownRefresh(){
        wx.showNavigationBarLoading() //在标题栏中显示加载
        this._getCode(this.data.id,0,function(){
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
        })
    },
    onOpen(e){
        let name =  e.currentTarget.dataset.name;
        let url = this.data.imgUrl + name;
        wx.previewImage({
            current:url , // 当前显示图片的http链接
            urls: [url] // 需要预览的图片http链接列表
        })
    },
    _getCode(id,start,cb){
        courseModel.myCode({
            myCourseId:id,
            start,
            limit:20
        }).then(res => {
            console.log(res);
            cb && cb();
            this.setData({
                codeList:res.data.items
            })
        })
    }
})