// components/actionsheet/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        isSelect:{
            type:Boolean,
            value:false
        },
        name:{
            type:String,
            value:'生成海报'
        }
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
        onCancel(){
            this.triggerEvent('myCancel', {}, {})
        },
        onCreate(){
            this.triggerEvent('myCreate', {}, {})
        }
    }
})
