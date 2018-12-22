// components/couponList/index.js
import {
    config
} from '../../config.js';
import {
    CouponModel
} from '../../models/coupon.js';

let couponModel = new CouponModel();


Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
    },
    attached(){
        //this._getCouponList()
    },
    /**
     * 组件的方法列表
     */
    methods: {
        //返回确认订单
        onGoback(e) {
            let coupon = e.currentTarget.dataset.item;
            if (coupon.isUse) {
            }
            
        },

        _getCouponList(id, sportTypeId) {
            couponModel.getMyCoupon({
                type: 3,
                sportId: sportTypeId,
                id
            }).then(res => {
                let reslut = res.data.data;
                this._dataHandle(reslut);
            })
        },
        //数据过滤  isUse 是否可用
        _dataHandle(reslut) {
            reslut.forEach(item => {
                //满减
                if (item.couponType == 0) {
                    if (this.data.total >= item.consume) {
                        item.isUse = true
                    } else {
                        item.isUse = false
                    }
                }
                //直接抵扣
                if (item.couponType == 1) {
                    item.isUse = true
                }
            })

            this.setData({
                couponList: reslut
            })
            console.log(reslut)
        }
    }
})