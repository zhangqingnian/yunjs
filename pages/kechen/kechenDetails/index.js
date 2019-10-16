// pages/kechen/kechenDetails/index.js
import {
    config
} from '../../../config.js';
import {
    VenueModel
} from '../../../models/venue.js';

let venueModel = new VenueModel();


Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShare: false,     //是否显示海报层
        isSelect: false,    //是否显示选择框
        imgUrl: config.base_img_url,
        course: {},
        classes:{},
        classList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
       
        let id = options.id || decodeURIComponent(options.scene).split('_')[0];
        this._getKcDetail(id);
    },
    //生成图片层
    onShare() {
        this.setData({
            isShare: true,
            isSelect: false
        })
    },
    //关闭图片层
    onCloseShare() {
        this.setData({
            isShare: false
        })
    },

    //显示选择框
    onSelect() {
        this.setData({
            isSelect: true
        })
    },
    //关闭选择框
    onCancelSelect() {
        this.setData({
            isSelect: false
        })
    },
    onShareAppMessage(Object) {
        return {
            title: this.data.course.courseName
        }
    },
    //进入场馆
    onGoVenue() {
        wx.navigateTo({
            url: '/pages/venueList/venueDetail/index?id=' + this.data.course.venueId,
        })
    },
    onSelectClass(e) {
        let classId = e.currentTarget.dataset.classid;
        this.data.classList.forEach(item => {
            if(item.classId == classId){
                item.isOn = true;
            }else{
                item.isOn = false;
            }
        })
        this.setData({
            classList:this.data.classList
        })
        this._getClass(classId)
    },
    //地图
    onMap(e){
        console.log(e.currentTarget.dataset)
        let { name, address, lat, lon } = e.currentTarget.dataset;
        wx.getLocation({//获取当前经纬度
            type: 'wgs84', //返回可以用于wx.openLocation的经纬度，
            success: function (res) {
                wx.openLocation({//​使用微信内置地图查看位置。
                    latitude: Number(lat),//要去的纬度-地址
                    longitude: Number(lon),//要去的经度-地址
                    name,
                    address
                })
            }
        })
    },
    onGoSubmit(e){
        let courser = JSON.stringify(this.data.course) ,
            classes = JSON.stringify(this.data.classes);
        wx.navigateTo({
            url: '/pages/confirmOrder/courser/index?courser=' + courser + '&classes=' + classes,
        })
    },
    //查看协议
    onElectronicProtocol(e) {
        let src = e.currentTarget.dataset.img;
        let imgSrc = config.base_img_url + src;
        wx.navigateTo({
            url: '/pages/electronicProtocol/index?imgSrc=' + imgSrc
        })
    },
    //课程详情
    _getKcDetail(id) {
        venueModel.getKcDetail(id).then(res => {
            let reslut = res.data.data;
            let classList = reslut.venueCourseClassVos;
            let fisrtId = classList[0].classId;
            classList.forEach( (item, i) => {
                if(i === 0){
                    item.isOn = true
                }else{
                    item.isOn = false
                }
            })
            this._getClass(fisrtId)
            console.log(res.data.data);
            this.setData({
                course: reslut,
                classList: classList,
                classId: fisrtId
            })
        })
    },
    //班级详情
    _getClass(id) {
        venueModel.getClass(id).then(res => {
            this.setData({
                classes: res.data.data
            })
        })
    }
   
})