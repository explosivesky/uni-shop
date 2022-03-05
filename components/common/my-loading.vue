<template>
	<view class="position-fixed top-0 right-0 left-0 bottom-0 d-flex a-center j-center bg-white" v-if="beforeReady" style="z-index: 10000;">
		<text class="main-text-color font">加载中...</text>
	</view>
</template>
<script>
	export default{
		props:{
			beforeReady:{
				type:Boolean,
				defaule:true
			}
		}
	}
</script>

<style>
</style>
