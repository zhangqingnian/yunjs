import { config } from '../config.js'



export class Http {
    request({ url, data, method, header }) {
        return new Promise((resolve, reject) => {
            this._request(url, resolve, reject, data, method, header);
        })
    }

    _request(url, resolve, reject, data = {}, method = 'GET', header) {
        wx.request({
            url: config.api_base_url + url,
            data: data,
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            method: method,
            success: (res) => {
                let code = res.statusCode.toString();
                if (code.startsWith('2')) {
                    resolve(res)
                } else {
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