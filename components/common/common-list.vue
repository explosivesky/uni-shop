<template>
	<view class="" @click="openDetail">
		<image :src="item.cover" style="height: 370rpx; width: 370rpx;"></image>
		<view class="p-2 px-1-5 d-flex flex-column j-center" style="box-sizing: border-box; height: 183rpx; width: 370rpx;">
			<view class="font font-weight">{{item.title}}</view>
			<view class="font-sm text-muted text-ellipsis" style="width: 370rpx;">{{item.desc}}</view>
			<view class="d-flex my-1">
				<price uniSize="font">{{item.oprice}}</price>
				<view class="font-sm text-muted line-through line-h a-self-end">￥{{item.pprice}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import price from '@/components/common/price.vue';
	export default{
		props:{
			item:Object,
			index:Number,
			type:{
				type:String,
				default:'navigateTo'
			}
		},
		components:{
			price
		},
		methods:{
			openDetail(){
				let detail = JSON.stringify(this.item)
				uni[this.type]({
					url:"/pages/detail/detail?detail="+detail
				})
			}
		}
	}
</script>

<style>
</style>
