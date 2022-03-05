<template>
	<view class="d-flex flex-column a-center j-center bg-light-secondary main-text-color font-md" style="height: 185rpx;">
		<view>{{title}}</view>
		<view class="position-relative" style="width: 750rpx; height: 70rpx;">
			<view class="text-light-muted position-absolute font text-center bg-light-secondary" style="left: 275rpx; width: 220rpx; z-index: 100;">
				{{titleTow}}
			</view>
			<view class="position-absolute" style="background-color: #dddddd; left: 0; top: 35rpx; right: 0; height: 3rpx;"></view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			title:{
				type:String,
				default:'热门推荐'
			},
			titleTow:{
				type:String,
				default:'买的人还买了'
			}
		}
	}
</script>

<style>
</style>
