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
        imgUrl: config.base_img_url,
        course: {},
        classes:{},
        classList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let id = options.id;
        this._getKcDetail(id);
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
                classList: classList
            })
        })
    },

    _getClass(id) {
        venueModel.getClass(id).then(res => {
            this.setData({
                classes: res.data.data
            })
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})