// pages/my/index.js
import {
    config
} from '../../config.js';
import {
    MyModel
} from '../../models/my.js';
let myModel = new MyModel();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        mobile:'',
        myInfo: {},
        list: [{
                icon: '/images/my/icon-1.png',
                name: '我的订单'
            },
            {
                icon: '/images/my/icon-2.png',
                name: '常用联系人信息'
            },
            {
                icon: '/images/my/icon-3.png',
                name: '常用学员信息'
            },
            {
                icon: '/images/my/icon-4.png',
                name: '账号安全'
            },
            {
                icon: '/images/my/icon-5.png',
                name: '拨打客服电话'
            },
            {
                icon: '/images/my/icon-6.png',
                name: '意见反馈'
            },
        ],
        bottomData: [{
                title: '优惠券',
                value: 0
            },
            {
                title: '余额',
                value: 0
            },
            {
                title: '赠送金额',
                value: 0
            },
            {
                title: '积分',
                value: 0
            },
            {
                title: '馆卡',
                value: 0
            },
            {
                title: '课程',
                value: 0
            },
            {
                title: '门票',
                value: 0
            },
            {
                title: '场地',
                value: 0
            },
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        
    },
    onShow() {
        let token = wx.getStorageSync('token').accessToken || '';
        this.setData({
            token
        })
        if (token) {
            this._getMyUserInfo();
        }
        
    },
    onUser(){
        if (!this.data.token) {
            wx.showToast({
                title: '请先登录!',
                icon: 'none'
            })
            return
        }
        wx.navigateTo({
            url: './user/index'
        })
    },
    onBottomTap(e) {
        if(!this.data.token){
            wx.showToast({
                title: '请先登录!',
                icon:'none'
            })
            return
        }
        let name = e.currentTarget.dataset.name;
        let url = this._goLocation(name);
        if (!url) {
            wx.showToast({
                title: '暂无',
            })
            return
        }
        wx.navigateTo({
            url,
        })
    },

    onListTap(e) {
        if (!this.data.token) {
            wx.showToast({
                title: '请先登录!',
                icon: 'none'
            })
            return
        }
        let name = e.currentTarget.dataset.name;
        let url = this._goLocation(name) || '';
        console.log(name)
        if (name == '拨打客服电话'){
            wx.makePhoneCall({
                phoneNumber: '021-50170666'
            })
            return
        }
        if (!url) {
            wx.showToast({
                title: '暂无',
            })
            return
        }

       
        wx.navigateTo({
            url,
        })

    },
    login(){
        wx.navigateTo({
            url: '/pages/authorize/index',
        })
    },
    _goLocation(title) {
        let _router = {
            
            '我的订单': './order/index',
            '常用联系人信息': './contacts/index',
            '常用学员信息': './student/index',
            '账号安全':'./safe/index',
            '优惠券':'./coupon/index',
            '课程': './kechen/index',
            '门票':'./ticket/index',
            '馆卡':'./card/index',
            '场地':'./area/index',
            '意见反馈':'./suggest/index',
            '积分':'./jifen/index',
            '余额':'./yue/index'
        }

        return _router[title]
    },
    _getMyInfo() {
        myModel.getMyInfo().then(res => {
            if (res.data.success) {
                let reslut = res.data.data;
                let _arr = [{
                        title: '优惠券',
                        value: reslut.coupon_total
                    },
                    {
                        title: '余额',
                        value: reslut.balance
                    },
                    {
                        title: '赠送金额',
                        value: reslut.give_money
                    },
                    {
                        title: '积分',
                        value: reslut.point_total
                    },
                    {
                        title: '馆卡',
                        value: reslut.myCardsTotal
                    },
                    {
                        title: '课程',
                        value: reslut.myCourseTotal
                    },
                    {
                        title: '门票',
                        value: reslut.entranceticketTotal
                    },
                    {
                        title: '场地',
                        value: reslut.areaTotal
                    },
                ]
                this.setData({
                    mobile:reslut.mobile,
                    bottomData:_arr
                })
            }


        })
    },
    _getMyUserInfo() {
        myModel.getMyUserInfo().then(res => {
            if(res.data.success){
                res.data.data.fileName = config.base_img_url + res.data.data.fileName;
                this.setData({
                    userInfo: res.data.data
                })
                this._getMyInfo();
            }
            
        })
    }
})