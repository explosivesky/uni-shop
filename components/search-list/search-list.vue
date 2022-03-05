<template>
	<view>
		<!-- 商品列表 -->
		<view class="py-3 border-bottom main-border-color px-2 animated fadeIn faster" v-for="(item,index) in list" :key="index" @click="openDetail(item)">
			<view class="d-flex" style="height: 250rpx;">
				<view class="">
					<image class="rounded" :src="item.titlepic" lazy-load style="height: 250rpx; width: 250rpx;"></image>
				</view>
				<view class="d-flex flex-column j-center py-1-5 ml-4">
					<view class="font-weight font-md">{{item.title}}</view>
					<view class="">{{item.desc}}</view>
					<price :fontWeight="true">{{item.pprice}}</price>
					<view class="">
						<text>{{item.comment_num}}条评论</text>
						<text class="ml-1">{{item.rate*100}}%满意度</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import price from "@/components/common/price.vue"
	export default {
		props:{
			list:Array
		},
		components:{
			price
		},
		methods:{
			openDetail(item){
				let detail = JSON.stringify(item)
				uni.navigateTo({
					url:"/pages/detail/detail?detail="+detail
				})
			}
		}
	}
</script>

<style>

</style>
