// pages/my/contacts/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
        arr:[
            { username: '大飞囊', iphone: '17777777771', isDefault: true, id:1},
            { username: '小海疼', iphone: '15987989719', isDefault: false, id:23 },
            { username: '发福蝶', iphone: '13788948579', isDefault: false, id:44 }
        ],
        imgSrc:'/images/my/icon_9.png',
        onImgSrc:'/images/my/icon_10.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

    onSelectDefault(e){ 
        console.log(1)
        let id = e.currentTarget.dataset.id;
        let oldArr = this.data.arr;
        let newArr = oldArr.map(item => {
            
            if(item.id == id){
                item.isDefault = true;
            }else{
                item.isDefault = false;
            }
            
            return item
        });
        console.log(newArr)
        this.setData({
            arr: newArr
        })
    },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})