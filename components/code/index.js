// components/code/index.js
import {
    config
} from '../../config.js';
Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    /**
     * 组件的属性列表
     */
    properties: {
        codeUrl:String,
        dColor:String
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
        onHide(){
            this.triggerEvent('hide',{},{})
        }
    }
})
