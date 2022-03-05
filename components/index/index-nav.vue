<template>
	<view class="">
		<!-- 图标 -->
		<view class="row m-2 j-center">
			<block v-for="(item,index) in resdata" :key="index">
				<view class="span-4 d-flex j-center a-center flex-wrap py-1" @click="event">
					<image :src="item.src" mode="widthFix" style="width: 60rpx; height: 60rpx;"></image>
					<text class="font-sm">{{item.text}}</text>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			resdata:Array
		},
		methods:{
			event(){
				// console.log('点击了图标')
			}
		}
	}
</script>

<style>
</style>
