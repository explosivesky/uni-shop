<template>
	<view>
		<view class="bg-white d-flex pl-3 mb-3 rounded" style="overflow: hidden; height: 200rpx;">
			<view class="d-flex flex-column j-center a-start" style="flex: 2;" :class="!item.status ? 'text-light-muted' : ''">
				<text class="font-md">{{item.title}}</text>
				<text class="font-sm text-light-muted">{{item.start_time | formatTime}}~{{item.end_time | formatTime}}</text>
			</view>
			<view class="flex-1 d-flex flex-column a-center j-center text-white font-md" :class="item.disabled || !item.status? 'bg-secondary' : 'main-bg-color'">
				<view class="d-flex a-center">
					<text>{{item.price}}</text>
					<text>{{item.type=== 0 ? '元' : '折'}}</text>
				</view>
				
				<text class="font-sm">{{item.desc}}</text>
				<text class="main-text-color px-3 bg-white mt-2" :class="item.disabled || !item.status ? 'text-secondary' : 'main-text-color'" style="border-radius: 5%; height: 40rpx; line-height: 40rpx;">
				<slot>{{item.status ? '去使用' : '已失效'}}</slot>
				</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			item:Object,
			index:Number
		},
		filters:{
			formatTime(shorttime) {
							shorttime = shorttime.toString().length<13 ? shorttime*1000 : shorttime;
							let date = new Date(shorttime)
							let parseNumber = (num)=>{
								return num < 10 ? "0" + num : num;
							}
							return date.getFullYear() +'-'+ parseNumber(date.getMonth() + 1) +'-'+ parseNumber(date.getDate())+' '+parseNumber(date.getHours())+':'+parseNumber(date.getMinutes())
						}
		}
	}
</script>

<style>
</style>
