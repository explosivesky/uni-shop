import App from './App'
import store from 'store/index.js'

//引入全局组件
import divider from "@/components/common/divider.vue"
Vue.component('divider',divider)
//引入全局 loading 组件
// import loading from "@/components/common/loading.vue"
// Vue.component('loading',loading)

import myLoading from "@/components/common/my-loading.vue"
Vue.component('my-loading',myLoading)

import request from '@/network/request.js'
Vue.prototype._api = request

Vue.prototype.navigateTo=(options)=>{
	//权限验证，如果没登陆则直接跳到 登录页面
	if(!store.state.userModule.token){
		uni.navigateTo({
			url: `/pages/login/login`
		});
		return uni.showToast({
			title: '请先登录',
			icon:'none'
		});
	}
	uni.navigateTo(options);
}
//工具函数
import $U from '@/common/util.js'
Vue.prototype.$U = $U

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App,
	store
})
app.$mount()
// #endif

