<template>
	<view>
		<!-- 三图广告 -->
		<view class="d-flex">
			<view class="">
				<image :src="resdata.big.src" lazy-load style="width: 373rpx; height: 530rpx; border-right: 2rpx solid #f8f9fb;"></image>
			</view>
			<view class="">
				<view class="d-flex flex-column">
					<image :src="resdata.smalltop.src" lazy-load style="width: 375rpx; height: 263rpx;"></image>
				</view>
				<view class="">
					<image :src="resdata.smallbottom.src" lazy-load style="width: 375rpx; height: 263rpx; border-top: 2rpx solid #f8f9fb;"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			resdata:Object
		}
	}
</script>

<style>
</style>
