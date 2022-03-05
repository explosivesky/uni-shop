let userModel={
	state:{
		token: '',
		userinfo:{},
		loginState:false
	},
	mutations:{
		login(state,userinfo){
			let info = JSON.stringify(userinfo)||{}
			let loginState = JSON.stringify(true)
			uni.setStorageSync('userinfo',info)
			uni.setStorageSync('loginState',loginState)
			state.token=userinfo.token
			state.userinfo=userinfo
			state.loginState=true
		},
		loginout(state){
			uni.removeStorageSync('userinfo')
			state.userinfo={}
			state.token=''
			state.loginState=false
		},
		init(state){
			state.token=uni.getStorageSync('userinfo') ? JSON.parse(uni.getStorageSync('userinfo')).token : ''
			state.userinfo=uni.getStorageSync('userinfo') ? JSON.parse(uni.getStorageSync('userinfo')) : {}
			state.loginState=uni.getStorageSync('loginState') ? JSON.parse(uni.getStorageSync('loginState')) : false
		}
	},
	actions:{
	},
	getters:{
	},
	namespaced:true
}
export default userModel