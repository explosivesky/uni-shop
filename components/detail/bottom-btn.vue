<template>
	<view class="">
		<!-- 底部操作条 -->
		<view class="d-flex a-stretch bg-white position-fixed bottom-0 left-0 right-0" style="height: 100rpx; z-index: 999;">
			<view class="d-flex flex-1 flex-column a-center j-center line-h-md">
				<view class="iconfont icon-xihuan text-light-muted"></view>收藏
			</view>
			<view class="d-flex flex-1 flex-column a-center j-center line-h-md position-relative" @click="navigateTo">
				<view class="iconfont icon-gouwuche text-light-muted"></view>
				<view class="position-absolute top-0" style="left: 100rpx;" v-if="GoodsCartCount>0||'99+'">
					<uni-badge class="uni-badge-left-margin" :text="GoodsCartCount" type="error" />
				</view>购物车
			</view>
			<view class="d-flex flex-column a-center j-center main-bg-color text-white" @click="$emit('show')" hover-class="main-bg-hover-color" style="flex: 2;">
				加入购物车
			</view>
		</view>
	</view>
	
</template>

<script>
	import {mapGetters} from 'vuex'
	export default{
		methods:{
			navigateTo(){
				uni.switchTab({
					url:"/pages/cart/cart"
				})
			}
		},
		computed:{
			...mapGetters('cartModule',['GoodsCartCount'])
		}
	}
</script>

<style>
</style>
