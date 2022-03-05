<template>
	<view class="p-3">
		<view class="py-3 d-flex position-relative font">
			<textarea placeholder="详细描述下你的退款原因吧" class="border border-color rounded flex-1 p-2 bg-white" 
			placeholder-class="text-light-muted" 
			:maxlength="maxlength"
			v-model="reason"></textarea>
			<view class="position-absolute text-light-muted" :class="remain >= 0 ? 'text-light-muted' : 'text-danger'" style="right: 30rpx; bottom: 30rpx;">
				{{remain}}/{{maxlength}}
			</view>
		</view>
		<!-- 提交 -->
		<view class="mt-3 border d-flex j-center rounded a-center" hover-class="bg-light-secondary" style="height: 90rpx; background-color: #FFFFFF;" @click="submit">
			提交
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				order_id:0,
				reason:'',
				maxlength:200,
				
			}
		},
		onLoad(e) {
			if(!e.detail){
				uni.showToast({
					title: '非法参数',
					icon:'none'
				});
				return uni.navigateBack({
					delta:1
				})
			}
			this.order_id = JSON.parse(e.detail).id
		},
		computed:{
			remain(){
				return this.maxlength - this.reason.length
			}
		},
		methods: {
			submit(){
				uni.showLoading({
					title: '退款中...',
					mask: false
				});
				this._api.post(`order/${this.order_id}/apply_refund`,{reason:this.reason},{token:true}).then(res=>{
					uni.hideLoading()
					uni.navigateBack({
						delta:1
					})
					uni.showToast({
						title: '退款成功',
						icon:'none'
					});
				}).catch(err=>{
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style>
page{
	background-color: #F5F5F5;
}
</style>
