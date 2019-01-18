import { config } from '../config.js'

export class Http {
    request({ url, data, method }) {
        return new Promise((resolve, reject) => {
            this._request(url, resolve, reject, data, method);
        })
    }

    _request(url, resolve, reject, data = {}, method = 'GET') {
        wx.request({
            url: config.api_base_url + url,
            data: data,
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'ACCESS_TOKEN': wx.getStorageSync('token').accessToken || ''
            },
            method: method,
            success: (res) => {
                let code = res.statusCode.toString();
                if (code.startsWith('2')) {
                    resolve(res)
                } else if(code == '401'){
                    wx.hideLoading();
                    wx.showModal({
                        title: '提示',
                        content: '请重新授权登录',
                        showCancel: false,
                        confirmText: '确定',
                        success(){
                            wx.navigateTo({
                                url: '/pages/authorize/index',
                            })
                        }
                    })

                } else if (code == '403'){
                    wx.showToast({
                        title: '您暂无此权限!',
                        icon:'none',
                        duration:1000
                    })
                }else {
                    reject();
                    let error_code = res.data.error_code;
                    this._showerr(error_code)
                }

            },
            fail: (res) => {
                reject();
            },
            complete: function (res) { }
        })
    }

    _showerr(error_code) {
        wx.showToast({
            title: '数据加载失败',
            icon: 'none',
            duration: 2000
        })
    }
}