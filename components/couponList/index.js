// components/couponList/index.js

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        aid:Number,
        sportTypeId:Number,
        total:Number,
        couponList:Array
    },

    /**
     * 组件的初始数据
     */
    data: {
    },
    /**
     * 组件的方法列表
     */
    methods: {
        //返回确认订单
        onGoback(e) {
            let coupon = e.currentTarget.dataset.item;
            if (coupon.isUse) {
                this.triggerEvent('coupon', coupon, {});
            } else{
                wx.showToast({
                    title: '该优惠券不可用',
                    icon:'none'
                })
            }             
        },
        onClose(){
            this.triggerEvent('coupon', {}, {});
        }
    
    }
})