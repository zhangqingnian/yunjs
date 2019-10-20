// pages/kechen/kechenDetails/index.js
import {
    config
} from '../../../config.js';
import {
    CardModel
} from '../../../models/card.js';
import {
    VenueModel
} from '../../../models/venue.js';
let cardModel = new CardModel();
let venueModel = new VenueModel();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: config.base_img_url,
        course: {},
        classes:{},
        classList:[],
        extend: '',
        showCoupon: true,  //优惠券显示
        isShareType:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //id 排序   venueGoodsId 商品   packageId 任务 customerId 分析 nickName 昵称
        console.log(options)
        let { id, venueGoodsId, packageId, customerId, nickName, type, isShareType} = options;
        var share = {};
        if(isShareType){
            this.setData({
                isShareType: true
            })
        }
        if (venueGoodsId) {
            share = options;
        }
        if (!venueGoodsId) {
            /*id 排序
                venueGoodsId 商品
                packageId 任务
                customerId 分析
                type 主管/分销员
                nickName 昵称 （不支持中文 没传）*/
            let arr = decodeURIComponent(options.scene).split('_');
            id = arr[0];
            venueGoodsId = arr[1];
            packageId = arr[2];
            customerId = arr[3];
            type = arr[4];
            nickName = '';
            share = {
                id,
                venueGoodsId,
                packageId,
                customerId,
                type,
                nickName
            }
            this.setData({
                isShareType:true
            })
        }


        //extend 详情页分享(推广)标识；
        let extend = options.extend || '';   

        this.setData({
            id, venueGoodsId, packageId, customerId, nickName, type, extend, share
        })
        
        
    },
    onShow() {
        let {
            id,
            venueGoodsId,
            packageId,
            customerId,
            type
        } = this.data;
        this._getKcDetail({ id, packageId, customerId, venueGoodsId, type });
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
    onGoOrder(){
        let course = this.data.course;
        course.courseName = course.courseName.replace(/\&/g, "%26");
        let classes = JSON.stringify(this.data.classes);
        let sortId = this.data.id
        let { venueGoodsId, packageId, customerId, type, money } = this.data;
        wx.navigateTo({
            url: '/pages/share/confirmOrder/courser/index?course=' + JSON.stringify(course) + '&classes=' + classes + '&sortId=' + sortId + '&money=' + money + '&venueGoodsId=' + venueGoodsId + '&packageId=' + packageId + '&customerId=' + customerId + '&type=' + type,
        })
    },
    onShareAppMessage(options) {
        let { id, venueGoodsId, packageId, customerId, nickName, type } = this.data;
        return {
            title: this.data.course.courseName,
            imageUrl: this.data.imgUrl + this.data.course.fileName,
            path: '/pages/share/venueCourseDetails/index?id=' + id + '&venueGoodsId=' + venueGoodsId + '&packageId=' + packageId + '&customerId=' + customerId + '&type=' + type + '&nickName=' + nickName + '&isShareType=yes'
        }
    },
    //使用优惠券
    onUserCoupon(e) {
        let coupon = e.currentTarget.dataset.coupon;
        let salePrice = this.data.course.salePrice;
        let money = salePrice - coupon;

        cardModel.getMark({
            couponMoney: coupon
        }).then(res => {
            let { data, msg, success } = res.data;
            if (success) {
                wx.showModal({
                    title: '提示',
                    content: data,
                    showCancel: false,
                    success: res => {
                        this.setData({
                            showCoupon: false,
                            money
                        })
                    }
                })
            }
        })
    },
    //进入店铺
    onGoVenue() {
        let { id, venueGoodsId, packageId, customerId, nickName } = this.data;
        wx.navigateTo({
            url: '/pages/share/shop/index?nickName=' + nickName + '&customerId=' + customerId,
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
            classes = JSON.stringify(this.data.classes),
            money = this.data.money,
            sortId = this.data.id;
        wx.navigateTo({
            url: '/pages/share/confirmOrder/courser/index?courser=' + courser + '&classes=' + classes + '&sortId=' + sortId+'&money=' + money,
        })
    },
    //课程详情
    _getKcDetail({ venueGoodsId, packageId, customerId ,type,id}) {
        cardModel.getCourseDetail({
            venueGoodsId,
            packageId,
            customerId,
            type,
            id
        }).then(res => {
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
                classId: fisrtId,
                money: reslut.salePrice
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