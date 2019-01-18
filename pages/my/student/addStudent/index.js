// pages/my/student/addStudent/index.js

import { MyModel } from '../../../../models/my.js';
import { config } from '../../../../config.js'
let myModel = new MyModel();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        img:'/images/my/icon_add.png',
        name: '',
        date: '请点击选择生日',
        currentSex: 1,
        iphone: '',
        height: '',
        weight: '',
        currentBody: 0,
        urgentName: '',
        urgentIphone: '',
        sex: [{
                value: 1,
                name: '男',
                checked: true
            },
            {
                value: 2,
                name: '女',
                checked: false
            },
            {
                value: 3,
                name: '保密',
                checked: false
            },
        ],
        body: [{
                value: 0,
                name: '优',
                checked: true
            },
            {
                value: 1,
                name: '良',
                checked: false
            },
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    //姓名
    onName(e) {
        this.setData({
            name: e.detail.value
        })
    },
    //生日
    bindDateChange(e) {
        this.setData({
            date: e.detail.value
        })
    },
    //性别
    sexChange(e) {
        this.setData({
            currentSex: e.detail.value
        })
    },
    //手机号
    onIphone(e) {
        this.setData({
            iphone: e.detail.value
        })
    },
    //身高
    onHeight(e) {
        this.setData({
            height: e.detail.value
        })
    },
    //体重
    onWeight(e) {
        this.setData({
            weight: e.detail.value
        })
    },
    //身体状况
    bodyChange(e) {
        this.setData({
            currentBody: e.detail.value
        })
    },
    //紧急联系人姓名
    onUrgentName(e) {
        this.setData({
            urgentName: e.detail.value
        })
    },
    //紧急联系人手机
    onUrgentIphone(e) {
        this.setData({
            urgentIphone: e.detail.value
        })
    },
    //上传头像
    onUpimg(e) {
        console.log(1)
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success:(res) => {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths[0]
                console.log(res);
                this.setData({
                    img: tempFilePaths
                })
            }
        })
    },
    onBaocun() {
        let {
            img,
            name,
            date,
            iphone,
            height,
            weight,
            urgentName,
            urgentIphone,
            currentSex,
            currentBody
        } = this.data;
        if (!name || (date == '请点击选择生日') || !iphone || !height || !weight || !urgentName || !urgentIphone) {
            wx.showToast({
                title: '请完善信息',
                icon: 'none',
                duration: 1000
            })
            return
        }

        if (img == '/images/my/icon_add.png'){
            wx.showToast({
                title: '请上传学员正面照',
                icon: 'none',
                duration: 1000
            })
            return
        }

        this._addStudentInfo();
    },
    _addStudentInfo(){
        let {
            img,
            name,
            date,
            iphone,
            height,
            weight,
            urgentName,
            urgentIphone,
            currentSex,
            currentBody
        } = this.data;

        wx.uploadFile({
            url: config.api_base_url +'m/crm/student/saveStudent', // 仅为示例，非真实的接口地址
            header:{
                'ACCESS_TOKEN': wx.getStorageSync('token').accessToken || ''
            },
            filePath: img,
            name: 'img',
            formData: {
                name,
                sex: currentSex,
                birthday: new Date(date).getTime(),
                mobile: iphone,
                height,
                weight,
                health: currentBody,
                emergencyName: urgentName,
                emergencyMobile: urgentIphone
            },
            success(res) {
                console.log(res);
                // do something
                let reslut =JSON.parse(res.data);
                wx.showToast({
                    title: reslut.msg,
                    icon:'none',
                    duration:500
                })
                if (res.errMsg == "uploadFile:ok" && reslut.success){
                    wx.navigateBack({
                        delta:1
                    })
                }
            }
        })


        
    }
    

})