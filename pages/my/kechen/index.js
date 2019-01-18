// pages/my/kechen/index.js
import { config } from '../../../config.js'
import { CourseModel } from '../../../models/course.js'

let courseModel = new CourseModel();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        valid: true,
        invalid: false,
        courseList: [],
        show: false,
        course: {},
        baseUrl: config.api_base_url,
        imgUrl: config.base_img_url,
        codeSrc: "m/crm/venueOrder/front/getVerificationCode?orderCode=",
        codeUrl: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this._getMyCourse(1, 0);
    },
    //使用
    onUse(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: './use/index?id='+id,
        })
    },
    //使用记录
    onRecord(e){
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: './record/index?id=' + id,
        })
    },

    onGoDetail(e) {
        console.log(e);
        let id = e.currentTarget.dataset.id;
        let valid = this.data.valid;
        wx.navigateTo({
            url: './detail/index?id=' + id + '&valid=' + valid
        })
    },
    //有效
    onValid() {
        this.setData({
            valid: true,
            invalid: false
        })
        this._getMyCourse(1, 0);

    },
    //无效
    onInvalid() {
        this.setData({
            valid: false,
            invalid: true
        })
        this._getMyCourse(2, 0);

    },
    //我的课程 type 1有效 2无效
    _getMyCourse(types, start) {
        wx.showLoading({
            title: '加载中'
        })
        courseModel.myCourseList({
            types,
            start,
            limit: 10
        }).then(res => {
            wx.hideLoading();
            this.setData({
                courseList: res.data.items
            })
            console.log(res);
        }).catch(err => {
            wx.hideLoading();
        })
    }
})