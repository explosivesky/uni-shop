// js 引入 vuex 的方式
import $store from '@/store/index.js'
export default {
	common: {
		baseUrl: 'http://ceshi3.dishait.cn/api/',
		// baseUrl: 'http://www.explosivesky.vip:3112/api/',
		
		header: {
			'Content-Type': 'application/json;charset=UTF-8',
		},
		data: {},
		method: 'GET',
		dataType: 'json'
	},
	request(options = {}) {
		options.url = this.common.baseUrl + options.url
		options.methods = options.methods || this.common.method
		options.data = options.data || this.common.data
		options.header = options.header || this.common.header
		options.dataType = options.dataType || this.common.dataType
		//只要传个 true 就会自动加 token
		if(options.token){
			options.header.token = $store.state.userModule.token
			//判断如果没有 token 那就跳转到登陆页面
			//但是有些功能，没登陆的情况下会请求方法会添加 token ，但是没登录就没有token
			//因为一些功能如果没登录的话，就不需要传 token 了
			if(options.checkToken&&!options.header.token){
				uni.navigateTo({
					url:"/pages/login/login"
				})
				return uni.showToast({
					title: '请先登录',
					icon:'none'
				});
			}
		}
		//请求
		return new Promise((resolve, reject) => {
			uni.request({
				...options,
				success: (result) => {
					//返回原始数据
					if(options.native){
						return resolve(result)
					}
					//请求失败
					if (result.statusCode !== 200) {
						//options.toast 为 true 就是自定义信息 不走这里
						if(!options.toast){
							uni.showToast({
								title: result.data.msg || '服务器错误',
								icon: 'none'
							})
						}
						return reject(result.data)
					}
					//成功
					resolve(result.data.data)
				},
				fail: (err) => {
					//不显示默认错误 当 toast 为true 的时候可以在 .catch 处理自定义错误
					if(!options.toast){
						uni.showToast({
							title: err.errMsg || '请求失败',
							icon: 'none'
						})
					}
					return reject()
				}
			})
		})
	},
	//get 请求
	get(url, data = {}, options = {}) {
		options.url = url
		options.data = data
		options.method = "GET"
		return this.request(options)
	},
	//post 请求
	post(url, data = {}, options = {}) {
		options.url = url
		options.data = data
		options.method = "POST"
		return this.request(options)
	},
	//delete 请求
	delete(url, data = {}, options = {}) {
		options.url = url
		options.data = data
		options.method = "DELETE"
		return this.request(options)
	},
}
