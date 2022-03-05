<template>
	<view class="font">
		<view class="" style="padding: 70rpx 0;">
			<view class="mt-4 d-flex flex-column j-sb a-center" style="height: 180rpx;">
				<image src="../../static/images/demo/demo10.jpg" style="height: 140rpx;width: 140rpx;"></image>
				<text class="text-light-muted">小米商城 1.2.3.0222.r1</text>
			</view>
		</view>
		<view class="">
			<uni-list-item :title="item.title" class="bg-white" rightIcon="icon-you" rightIconColor="#a2a2a2" v-for="(item,index) in value" :key="index"></uni-list-item>
		</view>
		<view class="mt-5 d-flex a-center j-center">
			<text class="text-light-muted">小米，为拉屎而生</text>
		</view>
	</view>
</template>

<script>
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue';
	export default {
		data() {
			return {
				value: [
					{ title: '版本更新', path: 'about' },
					{ title: '了解小米', path: '' },
					{ title: '官方微博', path: '' },
					{ title: '廉洁小米', path: '' },
					{ title: 'APP分享', path: '' },
					{ title: '授权直供店', path: '' },
					{ title: '清除缓存', path: '' }
				]
			}
		},
		components:{
			uniListItem
		},
		methods: {
			
		}
	}
</script>

<style>
page{
	background-color: #f5f5f5;
}
</style>
