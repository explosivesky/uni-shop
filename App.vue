<script>
	export default {
		onLaunch: function() {
			let userinfo = uni.getStorageSync('userinfo') ? JSON.parse(uni.getStorageSync('userinfo')) : false
			
			if(userinfo.token){
				//初始化用户信息
				this.$store.commit('userModule/init')
			}
			//请求购物车数据(显示角标)
			this.$store.dispatch('cartModule/updateCartData')
			//程序一加载就监听加载购物车数据事件
			uni.$on('updateCart',()=>{
				this.$store.dispatch('cartModule/updateCartData')
			})
		},
		onShow: function() {
			// this.init()
		},
		onHide: function() {
			// console.log('App Hide')
		},
	}
</script>

<style>
	/*每个页面公共css */
	@import url("/common/animate.css");
	@import url("/common/icon.css");
	@import url("/common/uni.css");
	@import url("/common/common.css");
	@import url("/common/zcm-main.css");
	@import url("/common/zcm-main-nvue.css");
	page{
		height: 100%;
		font-size: 28rpx;
		line-height: 1.8;
		background: #FFFFFF;
	}
</style>
