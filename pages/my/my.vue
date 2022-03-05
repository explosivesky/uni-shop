<template>
	<view>
		<!-- 头部 -->
		<view class="position-relative left-0 top-0 right-0 animated fadeIn faster" style="320rpx">
			<text class="iconfont icon-xiaoxi text-white position-absolute" @click="navigate('msg-list')" style="font-size: 50rpx; top: 70rpx; right: 20rpx; z-index: 20;"></text>
			<image src="/static/images/bg.jpg" class="w-100 position-absolute top-0" style="z-index: 0; height: 320rpx;"></image>
			<view class="d-flex j-sb position-absolute" style="z-index: 100; width: 750rpx; top: 120rpx;">
				<view class="d-flex j-center a-center ml-5">
					<view class="rounded-circle border mr-2" style="overflow: hidden; height: 145rpx; width: 145rpx; border-width: 5rpx; border-color: #FFFFFF;">
						<image :src="userinfo.avatar ? userinfo.avatar : '/static/images/demo/demo6.jpg'" class="rounded-circle" style="height: 145rpx; width: 145rpx;"></image>
					</view>
					<text class="text-white" @click="navigate('login',true)">{{userinfo.nickname ? userinfo.nickname : '登录/注册'}}</text>
				</view>
				<view class="d-flex flex-column j-center a-center a-self-end">
					<view class="d-flex j-center a-center" style="width: 280rpx; height: 70rpx; color: #c24400; background-color: #ffd43f; border-top-left-radius: 35rpx; border-bottom-left-radius: 35rpx;">
						<text class="mr-1 iconfont icon-huangguan"></text>
						<text>会员积分 0</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 我的订单 -->
		<card :showCover="false">
			<template #title>
				<view class="p-2 d-flex j-sb a-center w-100 font-md" style="margin-top: 320rpx;">
					<text>我的订单</text>
					<view class="d-flex font a-center" style="color: #6c7780;" @click="navigate('order')">
						<text class="mr-1">全部订单</text>
						<text class="iconfont icon-you"></text>
					</view>
				</view>
			</template>
		</card>
		<!-- 订单状态 -->
		<view class="d-flex" style="height: 135rpx;">
			<view class="span24-6 py-3 d-flex flex-column a-center j-center font-md" @click="navigate('order',false,item.index)" v-for="(item,index) in tabBars" :key="index">
				<text class="iconfont line-h-sm" :class="item.icon"></text>
				<text>{{item.name}}</text>
			</view>
		</view>
		<divider/>
		<!-- 广告 -->
		<view style="height: 290rpx; width: 750rpx;">
			<image src="/static/images/demo/demo4.png" style="height: 290rpx; width: 750rpx;"></image>
		</view>
		<!-- 列表 -->
		<uni-list-item style="height:100rpx;" rightIcon="icon-you" title="小米会员" leftIcon="icon-VIP" iconColor="#fdbf2f"></uni-list-item>
		<uni-list-item style="height:100rpx;" rightIcon="icon-you" title="会员中心" leftIcon="icon-huangguan" iconColor="#fdbf2f"></uni-list-item>
		<uni-list-item style="height:100rpx;" rightIcon="icon-you" title="小米会员" leftIcon="icon-xihuan" iconColor="#fa6c5e"></uni-list-item>
		<uni-list-item style="height:100rpx;" rightIcon="icon-you" title="小米之家" leftIcon="icon-shouye" iconColor="#fd8b45"></uni-list-item>
		<uni-list-item style="height:100rpx; border-bottom: none !important;" rightIcon="icon-you" title="更多功能" leftIcon="icon-gengduo" iconColor="#9ed45b"></uni-list-item>
		<divider/>
		<uni-list-item style="height:100rpx;" rightIcon="icon-you" title="更多设置" leftIcon="icon-icon_set_up" iconColor="#7f8d98" @click="navigate('user-set',true)"></uni-list-item>
		<my-loading :beforeReady="beforeReady"/>
	</view>
</template>

<script>
	import card from '@/components/common/card.vue'
	import divider from '@/components/common/divider.vue'
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue'
	import myLoading from "@/mixins/my-loading.js"
	
	import {mapMutations,mapState} from 'vuex'
	export default {
		mixins:[myLoading],
		data() {
			return {
				otherSet:[{
					icon:'icon-VIP',
					color:'#fdbf2f',
					name:'小米会员'
				},{
					icon:'icon-huangguan',
					color:'#fdbf2f',
					name:'会员中心'
				},{
					icon:'icon-xihuan',
					color:'#fa6c5e',
					name:'服务中心'
				},{
					icon:'icon-shouye',
					color:'#fd8b45',
					name:'小米之家'
				},{
					icon:'icon-gengduo',
					color:'#9ed45b',
					name:'更多功能'
				}],
				tabBars: [
					{
						name: '全部',
						icon: 'icon-fenlei',
						key:'all',
						index:0
					},
					{
						name: '待支付',
						icon: 'icon-wallet_icon',
						key:'reviewing',
						index:1
					},
					{
						name: '待收货',
						icon: 'icon-daishouhuo',
						key:'paying',
						index:2
					},
					{
						name: '待评价',
						icon: 'icon-pinglun1',
						key:'receiving',
						index:3
					}
				]
			}
		},
		components:{
			card,
			divider,
			uniListItem
		},
		mounted() {
			this.beforeReady=false
			
		},
		computed:{
			...mapState('userModule',{
				userinfo:state=>state.userinfo,
			}),
		},
		methods: {
			navigate(path,check=false,index=false){
				if(path==='login' && this.$store.state.userModule.loginState)return
				if(!path)return
				//登录后才可以显示
				if(!check){
					index ? (this.navigateTo({url: `/pages/${path}/${path}?index=`+index})) : (this.navigateTo({url: `/pages/${path}/${path}`}))
					return 
				}
				uni.navigateTo({
					url: `/pages/${path}/${path}`
				});
				
			}
		}
	}
</script>

<style>

</style>
