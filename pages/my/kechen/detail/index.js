// pages/my/kechen/detail/index.js
import { config } from '../../../../config.js'
import { CourseModel } from '../../../../models/course.js'

let courseModel = new CourseModel();

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let {
            id,
            valid
        } = options;
        this.setData({
            id,
            valid
        })

        this._getClass(id);
    },
    //查看协议
    onElectronicProtocol(e) {
        let src = e.currentTarget.dataset.img;
        let imgSrc = config.base_img_url + src;
        wx.navigateTo({
            url: '/pages/electronicProtocol/index?imgSrc=' + imgSrc
        })
    },
    _getClass(classId){
        courseModel.myCourseDetail({
            classId
        }).then(res => {
            console.log(res)
            this.setData({
                classes:res.data.data
            })
        })
    }

})