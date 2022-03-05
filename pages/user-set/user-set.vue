<template>
	<view class="page" style="height: 100%;">
		<card headTitle="账号管理" :showCover="false" bodyStyle="background-color: #FFFFFF;" v-if="loginState" :showBorderBottom="false">
			<uni-list-item rightIcon="icon-you" title="个人资料"></uni-list-item>
			<uni-list-item rightIcon="icon-you" title="收货地址" @click="navigate('user-path-list')"></uni-list-item>
		</card>
		<card :headTitle="list.label" :showCover="false" bodyStyle="background-color: #FFFFFF;" :showBorderBottom="false">
			<uni-list-item @click="navigate(item2.path)" rightIcon="icon-you" :title="item2.title" v-for="(item2,index2) in list.value" :key="index2"></uni-list-item>
		</card>
		<!-- 退出登录 -->
		<view class="mt-3 border mx-3 d-flex j-center rounded a-center" v-if="loginState" hover-class="bg-light-secondary" style="height: 90rpx; background-color: #FFFFFF;" @click="loginOutFn">
			退出登录
		</view>
	</view>
</template>

<script>
import card from '@/components/common/card.vue';
import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue';

	import {mapMutations,mapState} from 'vuex'
export default {
	data() {
		return {
			list: {
					label: '关于',
					value: [
						{ title: '关于商城', path: 'about' },
						{ title: '意见反馈', path: '' },
						{ title: '协议规则', path: '' },
						{ title: '资质证件', path: '' },
						{ title: '用户协议', path: '' },
						{ title: '隐私政策', path: '' }
					]
				}
		};
	},
	components: {
		card,
		uniListItem
	},
	onBackPress(){
		// return true
		uni.navigateTo({
			url: '/pages/my/my'
		});
	},
	computed:{
		...mapState('userModule',{
			token:state=>state.token,
			loginState:state=>state.loginState,
		})
	},
	methods: {
		...mapMutations('userModule',['loginout']),
		...mapMutations('cartModule',['clearCartData']),
		navigate(path){
			uni.navigateTo({
				url: `/pages/${path}/${path}`
			});
		},
		loginOutFn(){
			uni.showLoading({
				title:'退出中...',
				mask:true
			})
			if(this.token){
				this._api.post('logout',{},{token:true}).then(res=>{
					//清除用户信息数据
					this.loginout()
					//清除购物车数据
					this.clearCartData()
					uni.hideLoading()
					uni.navigateBack({
						delta:1
					})
					uni.showToast({
						title: '退出成功',
						icon:'none'
					});
				})
			}
		}
	}
};
</script>

<style scoped>
</style>
