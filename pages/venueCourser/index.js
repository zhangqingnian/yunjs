// pages/venueCourser/index.js
import {
    config
} from '../../config.js';
import {
    VenueModel
} from '../../models/venue.js';

let venueModel = new VenueModel();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      imgUrl: config.base_img_url,
      venueKc:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let id = options.id;
      this.setData({ id })
      let start = this.data.venueKc.length;
      this._getKc(id, start);
  },

    onGoDetail(e){
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/kechen/kechenDetails/index?id='+id,
        })
    },
    onShareAppMessage(Object) {

    },
    onReachBottom() {
        let start = this.data.venueKc.length;
        let total = this.data.total;
        let id = this.data.id;
        if (start >= total) return;
        this._getKc(id, start);
    },

    //课程
    _getKc(id, start) {
        wx.showLoading()
        venueModel.getKc({
            venueId: id,
            start,
            limit: 10
        }).then(res => {
            wx.hideLoading()
            let temArr = res.data.items.concat(this.data.venueKc)
            this.setData({
                venueKc: temArr,
                total: res.data.total
            })
        })
    },
  
 
    onShareAppMessage: function () {

    }
})