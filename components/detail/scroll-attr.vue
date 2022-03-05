<template>
	<!-- 滚动商品特性 -->
	<scroll-view scroll-x class="scroll-row" :scroll-with-animation="true">
		<view class="scroll-row-item" style="width: 170rpx; height: 110rpx;" v-for="(item,index) in baseAttr" :key="index">
			<view class="d-flex flex-column j-center a-center">
				<view class="iconfont line-h-sm" :class="item.icon"></view>
				<view class="font line-h-sm">{{item.title}}</view>
				<view class="font-sm text-light-muted line-h-sm">{{item.desc}}</view>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	export default{
		props:{
			baseAttr:{
				type:Array,
				default(){
					return[]
				}
			}
		},
	}
</script>

<style>
</style>
