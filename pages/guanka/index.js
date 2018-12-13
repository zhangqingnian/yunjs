// pages/guanka/index.js
import Data from '../../mock/data.js';


Page({

    /**
     * 页面的初始数据
     */
    data: {
        typeList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            typeList: Data
        })
    },
    selectType(e) {
        let id = e.currentTarget.dataset.id;
        let newTypeList = this.data.typeList.map(item => {
            if(item.id == id){
                item.isOn = true;
            }else{
                item.isOn = false;
            }
            return item
        })
        console.log(newTypeList);
        this.setData({
            typeList:newTypeList
        })
    },
    getData(id){
        
    }
})