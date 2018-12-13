// components/pay/index.js
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
        playlist: [{
                name: '微信支付',
                isOn: false,
                src: '/images/venuedetail/icon_wx.png'
            },
            {
                name: '余额支付',
                isOn: false,
                src: '/images/venuedetail/icon_yue.png'
            }
        ],
        onSrc: '/images/on.png',
        offSrc: '/images/off.png',
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onSelectPlay(e){
            let name = e.currentTarget.dataset.name;
            this.data.playlist.forEach(item => {
                if(item.name == name){
                    if(item.isOn)return;
                    item.isOn = true;
                }else{
                    item.isOn = false;
                }
            })
            this.setData({
                playlist:this.data.playlist
            })
        },
        onClose(){
            this.triggerEvent('close',{},{})
        }
    }
})