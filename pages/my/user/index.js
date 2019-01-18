// pages/my/user/index.js
import { config } from '../../../config.js';
import { QuestModel } from "../../../models/quest.js";
let questModel = new QuestModel();

Date.prototype.toLocaleString = function () {
    return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate()
};
Page({

    /**
     * 页面的初始数据
     */
    data: {
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
        ],
        sexs:1,
        provinceList:[],         //省份
        currentNodeCode:110101,  //默认地址的nodeCode
        provinceNodeCode:'11',
        cityNodeCode: '1101',
        districtNodeCode:'110101',
        region: ['北京市', '北京市', '东城区'], //默认地址
        IDcard:'',     //身份证
        birthday:'' ,   //生日
        nickName:'',   //昵称
        realName:'',   //真实姓名
        hobby:'',      //爱好
        height:'',
        weight:'',
        img:'' 
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        this._getProvince();
        this._getMyUserInfo();
    },
    //保存
    onBaocun(){
        questModel.updateUserInfo({
            name:this.data.nickName,
            birthday: new Date(this.data.birthday+'').getTime(),
            height:this.data.height,
            weight:this.data.weight,
            realName:this.data.realName,
            idCard:this.data.IDcard,
            hobby:this.data.hobby,
            province: this.data.provinceNodeCode,
            city: this.data.cityNodeCode,
            district: this.data.districtNodeCode,
            headImg: this.data.headImg || null,
            sex: this.data.sexs
        }).then(res => {
            console.log(res);
            wx.showToast({
                title: res.data.msg,
            })
            if(res.data.msg == '操作成功'){
                wx.navigateBack({
                    delta:1
                })
            }
        })
       
    },
    //头像
    onImg(){
        let that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths[0];
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
                        that.setData({
                            headImg:reslut.data
                        })
                        wx.showToast({
                            title: reslut.msg,
                            icon: 'none',
                            duration: 500
                        })
                    }
                })

            }
        })
    },
    //昵称
    onNickname(e){
        let nickName = e.detail.value.trim();
        this.setData({
            nickName
        })
    },
    //身份证
    onIDcard(e){
        let val = e.detail.value;
        let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
        if(!reg.test(val)){
            wx.showToast({
                title: '身份证号码不合法',
                icon:'none',
                duration:600
            })
            return
        }
        let birthday = this._getBirthdayFromIdCard(val);
        console.log(birthday)
        this.setData({
            IDcard:val,
            birthday
        })

    },
    //性别
    sexChange(e){
        console.log(e.detail.value)
        this.setData({
            sexs:e.detail.value
        })
    },
    //身高
    onHeight(e){
        let height = e.detail.value.trim();
        this.setData({
            height
        })
    },
    //体重
    onWeight(e){
        let weight = e.detail.value.trim();
        this.setData({
            weight
        })
    },
    //真实姓名
    onRealName(e){
        let realName = e.detail.value.trim();
        this.setData({
            realName
        })
    },
    //个人爱好
    onHobby(e){
        let hobby = e.detail.value.trim();
        this.setData({
            hobby
        })
    },
    //选择省市区监听
    bindRegionChange: function(e) {   
        let _this = this;    
        let _arr = e.detail.value;
        let _province = _arr[0];
        let _city = _arr[1];
        let _area = _arr[2];
        console.log(_province);
        this.setData({
            region: _arr
        })

        this.data.provinceList.forEach(item => {
            if (_province.indexOf(item.city) != -1 ) {
                let provinceNodeCode = item.nodeCode || '';
                console.log(provinceNodeCode)
                _this._getCity(provinceNodeCode,function(cityList){
                    cityList.forEach(item => {
                        if (_city.indexOf(item.city) != -1) {
                            let cityNodeCode = item.nodeCode
                            console.log(cityNodeCode)
                            _this._getCity(cityNodeCode, function (areaList) {
                                areaList.forEach(item => {
                                    if (_area.indexOf(item.city) != -1) {
                                        let districtNodeCode = item.nodeCode
                                        console.log(item.nodeCode)
                                        _this.setData({
                                            provinceNodeCode,
                                            cityNodeCode,
                                            districtNodeCode
                                        })
                                    }
                                })
                            })
                        }
                    })
                });
            }
        })
        
    },
    //获取省份
    _getProvince(){
        questModel.getProvince().then(res => {
            this.setData({
                provinceList :res.data
            })
        })
    },
    //获取 市/区
    _getCity(nodeCode,cb) {
        questModel.getCity({
            nodeCode
        }).then(res => {
            cb(res.data)
        })
    },
    _getBirthdayFromIdCard: function (idCard) {
        var birthday = "";
        if (idCard != null && idCard != "") {
            if (idCard.length == 15) {
                birthday = "19" + idCard.substr(6, 6);
            } else if (idCard.length == 18) {
                birthday = idCard.substr(6, 8);
            }

            birthday = birthday.replace(/(.{4})(.{2})/, "$1-$2-");
        }
        return birthday;
    },
    _getMyUserInfo(){
        let _this = this;
        questModel.getMyUserInfo().then(res => {
            let relsut = res.data.data;
            let province , city , district ;
            relsut.province = relsut.district || '北京';
            relsut.city = relsut.city || '北京市';
            relsut.district = relsut.district || '东城区';
            this.data.provinceList.forEach(item => {
                if (item.nodeCode == relsut.province){
                    province = item.city;
                    return;
                }
            })
            this._getCity(relsut.province,function(cityList){
                cityList.forEach(item =>{
                    if(item.nodeCode == relsut.city){
                        city = item.city;
                        _this._getCity(relsut.city, function (cityList) {
                            cityList.forEach(item => {
                                if (item.nodeCode == relsut.district) {
                                    district = item.city

                                    relsut.province = province || '北京市'
                                    relsut.city = city || '北京市'
                                    relsut.district = district || '东城区'
                                    let _region = [province, city, district];
                                    let sex = []
                                    if (!relsut.sex || (relsut.sex == 1)) {
                                        sex = [{
                                            value: 1,
                                            name: '男',
                                            checked: true
                                        },
                                        {
                                            value: 2,
                                            name: '女',
                                            checked: false
                                        },
                                        ]
                                    } else {
                                        sex = [{
                                            value: 1,
                                            name: '男',
                                            checked: false
                                        },
                                        {
                                            value: 2,
                                            name: '女',
                                            checked: true
                                        },
                                        ]
                                    }

                                    _this.setData({
                                        currentNodeCode: 110101,  //默认地址的nodeCode
                                        region: _region, //默认地址
                                        sex: sex,
                                        id: relsut.id,
                                        customerId: relsut.customerId,
                                        IDcard: relsut.idCard || '',     //身份证
                                        birthday: _this._getBirthdayFromIdCard(relsut.idCard) || '',   //生日
                                        nickName: relsut.name || '',   //昵称
                                        realName: relsut.realName || '',   //真实姓名
                                        hobby: relsut.hobby || '',      //爱好
                                        height: relsut.height || '',
                                        weight: relsut.weight || '',
                                        img: relsut.fileName ? config.base_img_url + relsut.fileName : ''
                                    })
                                }
                            })
                        })
                    }
                })
            })

            

            
        })
    }
})