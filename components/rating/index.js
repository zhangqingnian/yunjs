// components/rating/index.js
import { MyOrderModel} from '../../models/myOrder.js'
let myOrderModel = new MyOrderModel();

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        objectId:Number,
        ceid:Number, //是否评论
        stars:Number, //星级
        content:String //内容
    },

    /**
     * 组件的初始数据
     */
    data: {
        level: [
            { name: '好评', val: 5 ,isOn:true},
            { name: '中评', val: 3 , isOn: false},
            { name: '差评', val: 1 , isOn: false}
        ],
        stars:5,
        content:''
    },
    attached(){
        //1 => 5  0 => 3  -2 => 1;
        let stars = this.properties.stars;
        if(stars == 1){
            stars = 5
        }else if(stars == 0){
            stars = 3
        }else if(stars == -2){
            stats = 1
        }

        this.data.level.forEach(item => {
            if(item.val == stars){
                item.isOn = true
            }else{
                item.isOn = false
            }
        })
        
        this.setData({
            content: this.properties.content,
            ceid:this.properties.ceid ? true : false,
            level: this.data.level
        })
    },
    /**
     * 组件的方法列表
     */
    methods: {
        onClose(){
            this.triggerEvent('close', {}, {})
        },
        onSelecLevel(e){
            let currentItem = e.currentTarget.dataset.item;
            let level = this.data.level;
            level.forEach(item => {
                if(item.name == currentItem.name){
                    item.isOn = true,
                    this.setData({
                        stars:item.val
                    })
                }else{
                    item.isOn = false
                }
            })
            this.setData({
                level
            })
        },
        onIput(e){
            let content = e.detail.value.trim();
            this.setData({
                content
            })
        },
        onSubmit(){
            let {stars ,content} = this.data;
            let objectId = this.properties.objectId;
            if(!content){
                wx.showToast({
                    title: '请输入评论内容!',
                    icon:'none'
                })
                return
            }

            myOrderModel.orderRating({
                stars,
                content,
                objectId,
                evaluType:1
            }).then(res => {
                console.log(res)
                wx.showToast({
                    title: res.data.msg,
                    icon:'none'
                })
                if(res.data.msg == '操作成功'){
                    this.onClose();
                }
            })
        }
    }
})
