<template>
	<view class="font text-muted">
		<divider/>
		<!-- 申请售后的产品 -->
		<view class="bg-white pl-3 d-flex flex-column">
			<view class="border-bottom border-color py-2">
				申请售后的产品
			</view>
			<view class="d-flex a-center py-1-5">
				<image src="/static/images/demo/demo6.jpg" style="height: 100rpx; width: 100rpx;"></image>
				<view class="d-flex flex-column p-2">
					<text class="font-md text-dark">小米8 傻逼版 2B+3炮 鹏哥拉屎绿</text>
					<text>维修服务 : 剩余3秒</text>
				</view>
			</view>
		</view>
		<divider/>
	<!-- 服务类型 -->
		<view class="bg-white pl-3 d-flex flex-column">
			<view class="border-bottom border-color py-2">
				服务类型
			</view>
			<view class="py-3">
				<radio-groups :label="label"/>
			</view>
		</view>
		<divider/>
		<!-- 问题描述 -->
		<view class="bg-white pl-3 d-flex flex-column">
			<view class="border-bottom border-color py-2">
				问题描述
			</view>
			<view class="py-3 pr-3 d-flex position-relative font">
				<textarea placeholder="详细描述下你的问题吧" class="border border-color rounded flex-1 p-2" 
				placeholder-class="text-light-muted" 
				:maxlength="maxlength"
				v-model="content"></textarea>
				<view class="position-absolute text-light-muted" :class="remain >= 0 ? 'text-light-muted' : 'text-danger'" style="right: 50rpx; bottom: 30rpx;">
					{{remain}}/{{maxlength}}
				</view>
			</view>
		</view>
		<!-- 下一步 -->
		<view class="px-3 py-2 rounded m-3 main-bg-color text-white d-flex j-center a-center" hover-class="main-bg-hover-color">
			下一步
		</view>
	</view>
</template>

<script>
	import divider from "@/components/common/divider.vue"
	import radioGroups from "@/components/common/radio-groups.vue"
	export default {
		data() {
			return {
				label:{
					selected:0,
					list:[{name:'换屏'}]
				},
				content:'',
				maxlength:200
			}
		},
		components:{
			divider,
			radioGroups
		},
		computed:{
			// 剩余可输入字数
			remain(){
				return this.maxlength - this.content.length
			}
		
		},
		methods: {
			
		}
	}
</script>

<style>
page{
	background-color: #eeeeee;
}
</style>
<style scoped>
	.border-color{
		border-color: #efefef;
	}
</style>
