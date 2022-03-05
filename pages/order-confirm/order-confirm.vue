<template>
	<view>
		<!-- 头部 -->
		<view class="px-4 py-5 text-white font-md">
			<view class="d-flex a-center j-sb" @click="navigate('user-path-list', 'type=choose')">
				<view class="d-flex flex-column j-sb a-start flex-1" v-if="defaultPath">
					<view class="d-flex font-weight">
						<text class="mr-2">{{ defaultPath.name }}</text>
						<text class="mr-2">{{ defaultPath.phone }}</text>
						<view
							class="mr-2 border rounded font-sm d-flex a-center j-center mt-1"
							v-if="defaultPath.isDefault"
							style="height: 40rpx; border-color: #FFFFFF !important;"
						>
							<text style="margin: 5rpx 20rpx;">默认</text>
						</view>
					</view>
					<text class="font">{{ defaultPath.province }}-{{ defaultPath.city }}-{{ defaultPath.district }}-{{ defaultPath.address }}</text>
				</view>
				<template v-else>
					<view>您还没有设置收货地址</view>
				</template>
				<view class="iconfont icon-you" style="color: rgba(255,255,255,.5);"></view>
			</view>
		</view>

		<!-- 身体 -->
		<view class="position-fixed left-0 right-0 bottom-0 bg-color" style="border-top-left-radius: 20rpx; border-top-right-radius: 20rpx; height:  80%;">
			<uni-list-item class="bg-white">
				<scroll-view scroll-x style="width: 90%;">
					<view class="d-flex a-center flex-shrink">
						<image
							v-for="(item, index) in goodsList"
							:key="index"
							:src="item.cover"
							class="flex-shrink"
							style="margin-right: 8rpx; height: 88rpx; width: 88rpx;"
						></image>
					</view>
				</scroll-view>
				<template #icon>
					<text class="mr-2">共{{ goodsList.length }}件</text>
					<text class="iconfont icon-you text-light-muted"></text>
				</template>
			</uni-list-item>
			<uni-list-item class="bg-white">
				<text>商品总价</text>
				<template #icon>
					<price style="color: #000000 !important;">{{ totalPrice }}</price>
				</template>
			</uni-list-item>
			<uni-list-item class="bg-white">
				<text>运费</text>
				<template #icon>
					<text class="mr-2">包邮</text>
				</template>
			</uni-list-item>

			<uni-list-item class="bg-white" @click="useCoupon">
				<text>优惠券</text>
				<template #icon>
					<text class="main-text-color" v-if="coupon.id > 0">{{ coupon.type === 0 ? '-' + coupon.price + '元' : coupon.price + '折' }}</text>
					<text class="mr-2" v-else :class="couponCount === 0 ? 'text-light-muted' : 'main-text-color'">{{ couponCount === 0 ? '无可用' : couponCount + '张可用' }}</text>
					<text class="iconfont icon-you text-light-muted"></text>
				</template>
			</uni-list-item>

			<uni-list-item class="bg-white">
				<text class="main-text-color">小计</text>
				<template #icon>
					<price>{{ coupon.id > 0 ? afterPrice : totalPrice }}</price>
				</template>
			</uni-list-item>
			<uni-list-item class="bg-white mt-2" extraWidth="40%" @click="navigate('order-invoice')">
				<text class="main-text-color">发票</text>
				<template #icon>
					<text>电子发票-个人</text>
					<text class="ml-2 iconfont icon-you text-light-muted"></text>
				</template>
			</uni-list-item>
			<!-- 底部 -->
			<view class="position-fixed left-0 bottom-0 right-0 bg-white px-4 d-flex j-end a-center" style="height: 100rpx; z-index: 100;">
				<text class="mr-2">合计:</text>
				<price>{{ coupon.id > 0 ? afterPrice : totalPrice }}</price>
				<view class="d-flex j-center a-center"
				:class="loading ? 'bg-light-secondary' : 'main-bg-color'"
				 @click="openPayMethods" 
				style="height: 64rpx; width: 175rpx; border-radius: 35rpx;">
					<text :class="loading ? 'text-dark' : 'text-white'">{{loading ? '加载中' : '去付款'}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue';
import price from '@/components/common/price.vue';

import {mapState,mapGetters,mapActions} from 'vuex'
export default {
	data() {
		return {
			defaultPath:false,
			goodsList:[],
			couponCount:0,
			ids:[],//商品 id
			coupon:{
				id:0,
				price:0,
				type:0
			},
			loading:false,//防止重复下单
			order_id:0,//订单 id
		}
	},
	components:{
		uniListItem,
		price
	},
	computed:{
		...mapGetters('pathModule',['getDefaultPath']),
		...mapGetters('cartModule',['totalPrice']),
		...mapState('cartModule',{
			list:state=>state.list
		}),
		afterPrice(){
			//没有优惠券
			if(this.coupon.id ===0)return
			//满减
			if(this.coupon.type===0){
				return this.totalPrice - this.coupon.price
			}
			return (this.totalPrice * (this.coupon.price/10)).toFixed(2)
		}
	},
	onLoad(e) {
		//商品 id
		if(e.selectList){
			this.ids = JSON.parse(e.selectList)
		}
		//e.selectList 购物车选中的商品 id
		if(this.ids.length===0||this.list.length===0){
			uni.navigateBack({delta:1})
			e.selectList=[]
			return uni.showToast({
				title: '请选选择购物车商品',
				icon:'none'
			});
		}
		//其他相关请求
		this.__init()
		//监听地址列表页面选择的地址
		uni.$on('editPath',(res)=>{
			this.defaultPath=res
		})
		//监听优惠券页面选择优惠券
		uni.$on('useCoupon',res=>{
			this.coupon=res
		})
	},
	onShow() {
		//如果有订单则跳转订单详情
		if(this.order_id > 0){
			uni.redirectTo({
				url:'/pages/order-detail/order-detail?id='+this.order_id
			})
		}
	},
	onUnload() {
		//关闭事件及事件处理函数
		uni.$off('editPath',()=>{})
		uni.$off('useCoupon',()=>{})
	},
	methods: {
		...mapActions('pathModule',['getPathData']),
		//其他相关请求
		__init(){
			//根据购物车选中的商品 id 从购物车所有商品中找出选中过的商品数据
			this.goodsList = this.ids.map(i=>{
				return this.list.find(v=>v.id==i)
			})
			//请求收货地址数据
			this.getPathData({page:1,refresh:false}).then(res=>{
				//获取默认地址
				this.defaultPath = this.getDefaultPath
			})
			//当前订单可用优惠券数量
			this._api.post('coupon_count',{price:this.totalPrice},{token:true}).then(res=>{
				// this.couponCount = 2
				this.couponCount = res
			})
		},
		navigate(path,type){
			uni.navigateTo({
				url:type ? `/pages/${path}/${path}?${type}` : `/pages/${path}/${path}`
			})
		},
		//选择/查看 优惠券
		useCoupon(){
			uni.navigateTo({
				url: '/pages/order-coupon/order-coupon?totalPrice='+JSON.stringify(this.totalPrice)
			});
		},
		//下单/支付
		openPayMethods(){
			//收货地址是否为空
		if(!this.defaultPath){
			return uni.showToast({
				title: '请先选择收货地址',
				icon:'none'
			});
		}
		this.loading=true
		//获取 商品 id 和 收货地址 id
		let options={
			user_addresses_id:this.defaultPath.id,
			items:this.ids.join(',')
		}
		//获取优惠券 id
		if(this.coupon.id > 0)options.coupon_user_id=this.coupon.id
		//购物车下单
		this._api.post('order',options,{token:true}).then(res=>{
			this.loading=true
			this.order_id = res.id
			//获取订单 id  和 总价格
			let detail={id:res.id,totalPrice:res.total_price}
			uni.navigateTo({
				url:"/pages/pay-method/pay-method?detail="+JSON.stringify(detail)
			})
		}).catch(err=>{
			this.loading=false
			uni.showToast({
				title: '下单失败',
				icon:'none'
			});
		})
		}
	}
}
</script>

<style>
page {
	background-color: #fd6801;
}
</style>
<style>
.bg-color {
	background-color: #efeeec;
}
</style>
