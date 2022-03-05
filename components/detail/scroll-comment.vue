<template>
	<!-- 横向滚动评论 -->
	<view class="p-2">
		<scroll-view scroll-x class="scroll-row">
			<view
				class="scroll-row-item d-flex mr-2 flex-column bg-light-secondary p-2 rounded border"
				style="width: 617rpx; height: 420rpx;"
				v-for="(item, index) in comments"
				:key="index"
			>
				<view class="d-flex a-center">
					<view class="mr-2 rounded-circle" style="overflow: hidden; height: 70rpx; width: 70rpx;">
						<image :src="item.userpic" class="rounded-circle" style="height: 70rpx; width: 70rpx;"></image>
					</view>
					<view class="flex-1">
						<view class="font-md line-h-sm">{{ item.username }}</view>
						<view class="text-muted line-h-sm">{{ item.create_time }}</view>
					</view>
					<view class="text-muted">
						<text class="iconfont icon-dianzan"></text>
						{{ item.goods_num }}
					</view>
				</view>
				<view class="d-flex a-center my-auto">
					<text class="font-md text-ellipsis">{{ item.desc }}</text>
				</view>
				<view class="d-flex a-center j-start mt-3">
					<image :src="item2.src" style="width: 174rpx; height: 174rpx;" v-for="(item2, index2) in item.imgList" :key="index2"></image>
				</view>
			</view>
		</scroll-view>
		<!-- 更多评论 -->
			<view class="d-flex a-center j-center font mt-2" style="color: #007bff;" @click="openMoreComment">
				<text>更多评论</text>
				<text class="iconfont icon-you"></text>
			</view>
	</view>
</template>

<script>
export default {
	props: {
		comments: {
			type: Array,
			default() {
				return [];
			}
		},
		goods_id:{}
	},
	methods:{
		openMoreComment(){
			uni.navigateTo({
				url:`/pages/more-comment/more-comment?id=${this.goods_id}`
			})
		}
	}
};
</script>

<style></style>
