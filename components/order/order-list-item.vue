<template>
	<view class="d-flex a-center j-sb p-1 border-bottom">
		<!-- 图片 -->
		<view class="">
			<view class="border rounded mx-2 flex-shrink" style="height: 155rpx; width: 155rpx; overflow: hidden; border-color: #eeeeee !important;">
				<image :src="order_items.cover" style="height: 155rpx; width: 155rpx;"></image>
			</view>
		</view>
		<!-- 商品信息 -->
		<view class="d-flex flex-column j-center py-3" style="flex: 2;">
			<view class="font-md uni-ellipsis" style="color: #000000; width: 380rpx;">{{order_items.title}}</view>
			<text>{{order_items.attrs}}</text>
		</view>
		<!-- 价格 -->
		<view class="flex-1 d-flex flex-column flex-shrink j-center py-3">
			<text class="a-self-end d-flex mr-3">￥ {{order_items.pprice}}</text>
			<text class="a-self-end mr-3">x{{order_items.num}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			order_items:Object,
			order_index:Number
		}
	}
</script>

<style>
</style>
