// components/shareCode/index.js
import {
    config
} from '../../config.js';
import {
    VenueModel
} from '../../models/venue.js';

let venueModel = new VenueModel();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        goodId:{
            type: Number,
            optionalTypes: [String],
        },
        page:String,
        type:Number
    },
    data: {
        imgUrl: config.base_disImg_url,
        showKeep: false,
        src:''
    },
    attached(){
        console.log(this.data)
        this.getCode();
    },
    /**
     * 组件的初始数据
     */
    

    /**
     * 组件的方法列表
     */
    methods: {
        getCode(){
            let { goodId, page, type, imgUrl } = this.data;
            wx.showLoading();
            venueModel.sunCode({
                scene: goodId,
                page,
                type,
                goodId
            }).then(reslut => {
                wx.hideLoading();
                console.log(reslut);
                let src = reslut.data.data;
                if (reslut.data.success) {
                    this.setData({
                        src: imgUrl + src,
                        showKeep: true
                    })
                }

            })
        },
        saveShareImg(){
            let _this = this;
            wx.showLoading()
            wx.downloadFile({
                url: this.data.src,
                success: (res) => {
                    wx.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        complete: res => {
                            wx.hideLoading()
                            if (res.errMsg == "saveImageToPhotosAlbum:ok") {
                                wx.showToast({
                                    title: '保存成功',
                                    success: () => {
                                       this.close()
                                    }
                                })
                            }
                        }
                    })
                }
            })
        },
        close(){
            this.triggerEvent('close', {}, {})
        }
    }
})
