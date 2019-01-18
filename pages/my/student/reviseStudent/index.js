// pages/my/student/addStudent/index.js

import {MyModel} from '../../../../models/my.js';
import { config } from '../../../../config.js'
let myModel = new MyModel();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id:'',
        imgUrl: config.base_img_url,
        img:'',
        name: '',
        date: '',
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
        let id = options.id;
        this._getStudentDetail(id);
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

                wx.uploadFile({
                    url: config.api_base_url + 'm/file/front/upload',
                    filePath: tempFilePaths,
                    name: 'files',
                    success(res) {
                        console.log(res);
                        let reslut = res.data && JSON.parse(res.data);
                        wx.showToast({
                            title: reslut.msg,
                            icon: 'none',
                            duration: 500
                        })
                        if (res.errMsg == "uploadFile:ok" && reslut.success) {
                            wx.navigateBack({
                                delta: 1
                            })
                        }
                    }
                })

            }
        })
    },
    onBaocun() {
        let {
            id,
            item,
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
        if (!name || !date || !iphone || !height || !weight || !urgentName || !urgentIphone) {
            wx.showToast({
                title: '请完善信息',
                icon: 'none',
                duration: 1000
            })
            return
        }  
        let oldImage = config.base_img_url + item.image;
        //图片是否改变
        if (img == oldImage){
            wx.request({
                url: config.api_base_url +"m/crm/student/updateStudent",
                method:'POST',
                header:{
                    'content-type': 'multipart/form-data',
                    'ACCESS_TOKEN': wx.getStorageSync('token').accessToken || ''
                },
                data:{
                    name,
                    sex: currentSex,
                    birthday: new Date(date).getTime(),
                    mobile: iphone,
                    height,
                    weight,
                    health: currentBody,
                    emergencyName: urgentName,
                    emergencyMobile: urgentIphone,
                    id
                },
                success(res){
                    console.log(res);
                }
            })
           
        }else{
            this._reviseStudentInfo();
        }

        
    },
    _getStudentDetail(id){
        myModel.getStudentDetail({
            id
        }).then(res => {
            console.log(res.data)
            let item = res.data;
            this.setData({
                item,
                img: config.base_img_url + item.image,
                name:item.name,
                date: item.birth,
                currentSex:this._sex(item.sexs),
                iphone: item.mobile,
                height: item.height,
                weight:item.weight,
                currentBody:item.health,
                urgentName: item.emergencyName,
                urgentIphone: item.emergencyMobile,
                id:item.id
            })
        })
    },
    _reviseStudentInfo(){
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
            currentBody,
            id
        } = this.data;

        wx.uploadFile({
            url: config.api_base_url +'m/crm/student/updateStudent',
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
                emergencyMobile: urgentIphone,
                id
            },
            success(res) {
                console.log(res);
                let reslut =res.data && JSON.parse(res.data);
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


        
    },
    _sex(str){
        if(str == '男'){
            return 0
        }else if(str == '女'){
            return 1
        }else{
            return 3
        }
    }
})