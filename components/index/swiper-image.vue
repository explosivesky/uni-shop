<template>
	<!-- 轮播图 -->
	<swiper :style="getHeight" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="200" :circular="true">
		<block v-for="(item,index) in resdata" :key="index">
			<swiper-item>
				<view class="swiper-item" @click="event(item,index)">
					<image :src="item.src" :style="getHeight" lazy-load></image>
				</view>
			</swiper-item>
		</block>
	</swiper>
</template>

<script>
	export default {
		props:{
			resdata:Array,
			height:{
				type:Number,
				default:350
			},
			preview:{
				type:Boolean,
				default:false
			}
		},
		computed:{
			getHeight(){
				return `height: ${this.height}rpx;`
			},
			getUrls(){
				return this.resdata.map(v=>v.src)
			}
		},
		methods:{
			event(item,index){
				//查看大图
				if(this.preview){
					uni.previewImage({
						current:index,
						urls:this.getUrls
					})
				}
			}
		},
	}
</script>

<style>
</style>
