// components/share/index.js
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
        goods: Object,  //商品
        page: String,    //要跳转的页面
        type: Number,
        share: {
            type:Object,
            value:{}
        },   //分销员推广 携带的信息

    },
    attached() {
        console.log(this.data.goods)

        this.getAvaterInfo();

    },
    /**
     * 组件的初始数据
     */
    data: {
        showKeep: false,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 先下载主图
         */
        getAvaterInfo: function () {
            wx.showLoading({
                title: '生成中...',
                mask: true,
            });
            var that = this;
            wx.downloadFile({
                url: config.base_img_url + (that.data.goods.fileName || that.data.goods.ticketImg), //商品主图
                success: function (res) {
                    wx.hideLoading();
                    if (res.statusCode === 200) {
                        var avaterSrc = res.tempFilePath; //下载成功返回结果
                        that.getQrCode(avaterSrc); //继续下载二维码图片
                    } else {
                        wx.showToast({
                            title: '商品主图下载失败！',
                            icon: 'none',
                            duration: 2000,
                            success: function () {
                                var avaterSrc = "";
                                that.getQrCode(avaterSrc);
                            }
                        })
                    }
                }
            })
        },

        /**
         * 下载二维码图片
         */
        getQrCode: function (avaterSrc) {
            wx.showLoading({
                title: '生成中...',
                mask: true,
            });
            let share = this.data.share;   
            let goods = this.data.goods;
            let id = goods.id,          //商品的ID
                type = this.data.type,
                page = this.data.page;
            //商品名 价格 市场价 统一 
            let goodsName = goods.cardName || goods.courseName || goods.ticketName || ''
            let price = goods.buyMoney || goods.price || goods.ticketPrice || ''
            let marketPrice = ''
            let scene = id;

            if(goods.salePrice){
                price = goods.salePrice;
                marketPrice = goods.buyMoney || goods.price + '';
            }
            
            /*
                id 排序   
                venueGoodsId 商品   
                packageId 任务 
                customerId 分析 
                type 主管/分销员
                nickName 昵称 （不支持中文 没传）
            */

            if (share.customerId) {
                scene = share.id + '_' + share.venueGoodsId + '_' + share.packageId + '_' + share.customerId +'_' + share.type;
            }

            console.log(scene)
            

            venueModel.sunCode({
                scene,
                page,
                type,
                goodId: id
            }).then(reslut => {
                console.log(reslut);
                if (reslut.data.success) {
                    let codeName = reslut.data.data;
                    var that = this;
                    wx.downloadFile({
                        url: config.base_disImg_url + codeName, //二维码路径
                        success: res => {
                            wx.hideLoading();
                            if (res.statusCode === 200) {
                                var codeSrc = res.tempFilePath;
                                that.sharePosteCanvas(avaterSrc, codeSrc, goodsName, price, marketPrice);
                            } else {
                                wx.showToast({
                                    title: '二维码下载失败！',
                                    icon: 'none',
                                    duration: 2000,
                                    success: function () {
                                        var codeSrc = "";
                                        that.sharePosteCanvas(avaterSrc, codeSrc, goodsName, price, marketPrice);
                                    }
                                })
                            }
                        }
                    })
                }
            })

        },

        /**
         * 开始用canvas绘制分享海报
         * @param avaterSrc 下载的头像图片路径
         * @param codeSrc   下载的二维码图片路径
         */
        sharePosteCanvas: function (avaterSrc, codeSrc, goodsName, price, marketPrice) {
            wx.showLoading({
                title: '生成中...',
                mask: true,
            })
            var that = this;
            var cardInfo = that.data.cardInfo; //需要绘制的数据集合
            const ctx = wx.createCanvasContext('myCanvas', that); //创建画布
            var width = "";
            const query = this.createSelectorQuery();
            query.select('#canvas-container')
                .boundingClientRect(function (rect) {
                    var height = rect.height / 0.6;
                    var right = rect.right;
                    width = rect.width;
                    var left = 15;
                    ctx.setFillStyle('#fff');
                    ctx.fillRect(0, 0, rect.width, height);
                    //商品主图
                    ctx.drawImage(avaterSrc, 15, 15, 230, 134);
                    ctx.setFontSize(14);
                    ctx.setFillStyle('#fff');
                    ctx.setTextAlign('left');

                    ctx.setFillStyle('rgba(17,205,110,0.5)')
                    ctx.fillRect(15, 119, 230, 30);
                    ctx.setFillStyle('#fff');
                    ctx.fillText('名额有限赶快订购吧', 28, 140);


                    //商品名称
                    ctx.setFontSize(13);
                    ctx.setFillStyle('#323232');
                    ctx.setTextAlign('left');
                    let [strLength, arr, rows] =
                        that.textByteLength(goodsName, 20)
                    let contentHh = 15 * 1.3;
                    for (let m = 0; m < arr.length; m++) {
                        ctx.fillText(arr[m], 15, 170 + contentHh * m);
                    }

                    //价格
                    ctx.setFontSize(18);
                    ctx.setFillStyle('#DA0808');
                    ctx.setTextAlign('left');
                    ctx.fillText('￥' + price, 15, 180 + contentHh * arr.length);

                    if (marketPrice) {
                        ctx.setFontSize(12);
                        ctx.setFillStyle('#323232');
                        ctx.setTextAlign('left');
                        ctx.fillText('市场价', 15, 200 + contentHh * arr.length);
                        ctx.beginPath()
                        ctx.moveTo(52, 197 + contentHh * arr.length)
                
                        ctx.lineTo(52 + 10 + marketPrice.toString().length * 7.5 , 197 + contentHh * arr.length)
                        ctx.stroke()
                        ctx.fillText('¥' + marketPrice, 55, 200 + contentHh * arr.length);
                    }

                    //  绘制二维码
                    if (codeSrc){
                        ctx.drawImage(codeSrc, left + 150, 170, width / 3, width / 3)
                        ctx.setFontSize(10);
                        ctx.setFillStyle('#000');
                    }
                    
                    //ctx.fillText("微信扫码或长按识别", left + 150, width / 3 + 180);


                }).exec()

            setTimeout(() => {
                ctx.draw();
                this.setData({
                    showKeep: true    //显示确定按钮
                })
                wx.hideLoading();
            }, 1000)

        },

        /**
         * 多行文字处理，每行显示数量
         * @param text 为传入的文本
         * @param num  为单行显示的字节长度
         */
        textByteLength(text, num) {
            let strLength = 0; // text byte length
            let rows = 1;
            let str = 0;
            let arr = [];
            for (let j = 0; j < text.length; j++) {
                if (text.charCodeAt(j) > 255) {
                    strLength += 2;
                    if (strLength > rows * num) {
                        strLength++;
                        arr.push(text.slice(str, j));
                        str = j;
                        rows++;
                    }
                } else {
                    strLength++;
                    if (strLength > rows * num) {
                        arr.push(text.slice(str, j));
                        str = j;
                        rows++;
                    }
                }
            }
            arr.push(text.slice(str, text.length));
            return [strLength, arr, rows] //  [处理文字的总字节长度，每行显示内容的数组，行数]
        },

        //点击保存到相册
        saveShareImg: function () {
            var that = this;
            wx.showLoading({
                title: '正在保存',
                mask: true,
            })
            setTimeout(function () {
                wx.canvasToTempFilePath({
                    canvasId: 'myCanvas',
                    success: function (res) {
                        wx.hideLoading();
                        var tempFilePath = res.tempFilePath;
                        wx.saveImageToPhotosAlbum({
                            filePath: tempFilePath,
                            success(res) {
                                wx.showModal({
                                    content: '图片已保存到相册，赶紧晒一下吧~',
                                    showCancel: false,
                                    confirmText: '好的',
                                    confirmColor: '#333',
                                    success: function (res) {
                                        that.closePoste();
                                        if (res.confirm) { }
                                    },
                                    fail: function (res) {
                                        console.log(res)
                                    }
                                })
                            },
                            fail: function (err) {
                                if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || 
                                    err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                                    // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
                                    wx.showModal({
                                        title: '提示',
                                        content: '需要您授权保存相册',
                                        showCancel: false,
                                        success: modalSuccess => {
                                            wx.openSetting({
                                                success(settingdata) {
                                                    console.log("settingdata", settingdata)
                                                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                                                        wx.showModal({
                                                            title: '提示',
                                                            content: '获取权限成功,再次点击图片即可保存',
                                                            showCancel: false,
                                                        })
                                                    } else {
                                                        wx.showModal({
                                                            title: '提示',
                                                            content: '获取权限失败，将无法保存到相册哦~',
                                                            showCancel: false,
                                                        })
                                                    }
                                                },
                                                fail(failData) {
                                                    console.log("failData", failData)
                                                },
                                                complete(finishData) {
                                                    console.log("finishData", finishData)
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    },
                    fail: function (err) {
                        console.log(err)
                    }
                }, that);
            }, 1000);
        },
        //关闭海报
        closePoste: function () {
            this.setData({
                showKeep: false
            })
            // detail对象，提供给事件监听函数
            this.triggerEvent('close',{},{})
        },
    }
})
