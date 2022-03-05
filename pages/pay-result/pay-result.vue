<template>
	<view>
		<view class="my-5 d-flex flex-column a-center j-center">
			<view class="iconfont icon-iconfontxuanzhong4 main-text-color line-h-sm" style="font-size: 120rpx;"></view>
			<view class="font-weight font-md line-h-sm">支付成功</view>
		</view>
		<view class="px-4">
			<view class="d-flex j-center a-center py-2 main-bg-color mb-3 text-white rounded" hover-class="main-bg-hover-color" @click="openDetail">
				<text>查看订单</text>
			</view>
			<view class="d-flex j-center border py-2 a-center rounded" @click="openIndex">
				<text>返回首页</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			openIndex(){
				uni.switchTab({
					url:'/pages/index/index'
				})
			},
			openDetail(){
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style>

</style>
