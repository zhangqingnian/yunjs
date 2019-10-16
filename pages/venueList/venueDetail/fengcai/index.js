// pages/venueList/venueDetail/fengcai/index.js
import {
    config
} from '../../../../config.js';
import {
    VenueModel
} from '../../../../models/venue.js';

let venueModel = new VenueModel();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: config.base_img_url
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let id = options.id;
        this.setData({
            id
        })
        
    },
    onShow(){
        let id = this.data.id;
        this._getFc(id)
    },
    onOpenImg(e){
        let name = e.currentTarget.dataset.name;
        let url = this.data.imgUrl + name;
        wx.previewImage({
            current: url, // 当前显示图片的http链接
            urls: [url] // 需要预览的图片http链接列表
        })
    },
    //风采
    _getFc(id) {
        venueModel.getFc({
            id: id,
            start: 0,
            limit: 20
        }).then(res => {
            console.log(res);
            this.setData({
                venueFc: res.data.items
            })
        })
    },

})