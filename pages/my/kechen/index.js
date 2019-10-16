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
        types: 1,
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
    onReachBottom() {
        let start = this.data.courseList.length;
        let types = this.data.types;
        let total = this.data.total;
        if (start >= total) return;
        this._getMyCourse(types, start);

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
            invalid: false,
            types: 1,
            courseList:[]
        })
        this._getMyCourse(1, 0);

    },
    //无效
    onInvalid() {
        this.setData({
            valid: false,
            invalid: true,
            types: 2,
            courseList:[]
        })
        this._getMyCourse(2, 0);

    },
    //我的课程 type 1有效 2无效
    _getMyCourse(types, start) {
        wx.showLoading()
        courseModel.myCourseList({
            types,
            start,
            limit: 20
        }).then(res => {
            wx.hideLoading();
            let temArr = this.data.courseList.concat(res.data.items)
            this.setData({
                courseList: temArr,
                total: res.data.total
            })
        }).catch(err => {
            wx.hideLoading();
        })
    }
})