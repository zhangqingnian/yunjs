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


    },
    attached() {
        console.log(this.data)

        this.getAvaterInfo();

    },
    /**
     * 组件的初始数据
     */
    data: {
        showKeep: false,
        cardInfo: {
            avater: "https://app.realmtech.cn/m/file/front/display/2018062239C0501998B68F07.jpg", //需要https图片路径
            qrCode: "https://app.realmtech.cn/m/file/front/disDisplay/20190408E614E44558D122B9.png", //需要https图片路径
            TagText: "小姐姐", //标签
            Name: '小姐姐', //姓名
            Position: "程序员鼓励师", //职位
            Mobile: "138", //手机
            Company: "才华无限有限公司", //公司
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 先下载头像图片
         */
        getAvaterInfo: function () {
            wx.showLoading({
                title: '生成中...',
                mask: true,
            });
            var that = this;
            wx.downloadFile({
                url: config.base_img_url + that.data.goods.fileName, //商品主图
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
            let id = this.data.goods.id, //商品的ID
                type = this.data.type,
                page = this.data.page;
            //商品名 价格 市场价 统一    
            let goodsName = this.data.goods.cardName || ''
            let price = this.data.goods.buyMoney || ''
            let marketPrice = ''

            venueModel.sunCode({
                scene: id,
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
                    console.log(width)
                    //商品主图
                    ctx.drawImage(avaterSrc, 15, 15, 230, 134);
                    ctx.setFontSize(14);
                    ctx.setFillStyle('#fff');
                    ctx.setTextAlign('left');

                    ctx.setFillStyle('rgba(17,205,110,0.5)')
                    ctx.fillRect(15, 119, 230, 30);
                    ctx.setFillStyle('#fff');
                    ctx.fillText('限时抢购 超值低价', 28, 140);


                    //商品名称
                    ctx.setFontSize(15);
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
                        ctx.moveTo(55, 197 + contentHh * arr.length)
                        ctx.lineTo(53 + marketPrice.length * 7.5, 197 + contentHh * arr.length)
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
                            fail: function (res) {
                                wx.showToast({
                                    title: res.errMsg,
                                    icon: 'none',
                                    duration: 2000
                                })
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
