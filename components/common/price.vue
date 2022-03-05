<template>
	<view class="d-flex main-text-color mr-2 line-h" :class="priceSize">
		<text class="a-self-start" :class="uniSize">￥</text><slot/>
	</view>
</template>

<script>
	export default{
		props:{
			fontWeight:{
				type:Boolean,
				default:false
			},
			uniSize:{
				type:String,
				default:'font-sm'
			},
			priceSize:{
				type:String,
				default:'font-md'
			}
		}
	}
</script>

<style>
</style>
