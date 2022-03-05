<template>
	<view class="d-flex flex-column j-center a-center text-light-muted" style="height: 450rpx; width: 100%; background-color: #f5f5f5;">
		<image :src="imgSrc" mode="" style="width: 260rpx; height: 190rpx;"></image>
		<view>{{noThingText}}</view>
	</view>
</template>

<script>
	export default{
		props:{
			noThingImgSrc:{
				type:String,
				default:''
			},
			noThingText:{
				type:String,
				default:''
			},
		},
		computed:{
			imgSrc(){
				return `/static/images/nothing/${this.noThingImgSrc}.png`
			}
		}
	}
</script>

<style>
</style>
