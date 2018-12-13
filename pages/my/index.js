// pages/my/index.js

Page({

    /**
     * 页面的初始数据
     */
    data: {
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
                value: 23
            },
            {
                title: '余额',
                value: 23
            },
            {
                title: '赠送金额',
                value: 23
            },
            {
                title: '积分',
                value: 23
            },
            {
                title: '馆卡',
                value: 23
            },
            {
                title: '课程',
                value: 23
            },
            {
                title: '门票',
                value: 23
            },
            {
                title: '场地',
                value: 23
            },
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    onBottomTap(e){
        let name = e.currentTarget.dataset.name;
        let url = this._goLocation(name);
        wx.navigateTo({
            url,
        })
    },

    onListTap(e){
        let name = e.currentTarget.dataset.name;
        let url = this._goLocation(name);
        wx.navigateTo({
            url,
        })
    },

    _goLocation(title){
        let _router = {
            '课程': './kechen/index',
            '我的订单': './order/index',
            '常用联系人信息':'./contacts/index',
            '常用学员信息':'./student/index'
        }

        return _router[title]
        // switch (title){
        //     case '课程':
        //         return './kechen/index';
        //     case '我的订单':
        //         return './order/index'    
        // }
    }
    
})