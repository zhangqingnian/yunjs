// pages/venueList/venueDetail/rating/index.js
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
        imgUrl: config.base_img_url,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let id = options.id;
        this._getRating(id);
    },

    //评论
    _getRating(id) {
        venueModel.getRating({
            id,
            start:0,
            limit:20
        }).then(res => {
            this.setData({
                venueRating: res.data.items
            })
        })
    },
})