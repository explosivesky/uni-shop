<template>
	<!-- 基础详情 -->
	<view class="p-2">
		<view class="font-lg">{{detail.title}}</view>
		<view class="text-light-muted mb-3  line-h-sm">{{detail.desc}}</view>
		<price priceSize="font-lg" uniSize="font">{{showPrice}}</price>
	</view>
</template>

<script>
	import price from "@/components/common/price.vue"	
	export default{
		props:{
			detail:{
				type:Object,
				default(){
					return{}
				}
			},
			showPrice:{}
		},
		components:{
			price
		},
	}
</script>

<style>
</style>
