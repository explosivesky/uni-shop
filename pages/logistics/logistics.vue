<template>
	<view>
		<view class="uni-timeline" style="padding: 30rpx 20rpx;background-color: #fff;">
			<view
				class="uni-timeline-item"
				v-for="(item, index) in list"
				:key="index"
				:class="{ 'uni-timeline-first-item': index === 0, 'uni-timeline-last-item': index === list.length - 1 }"
			>
				<view class="uni-timeline-item-divider"></view>
				<view class="uni-timeline-item-content">
					<view>{{ item.status }}</view>
					<view class="datetime">{{ item.time }}</view>
				</view>
			</view>
		</view>
		<!-- 暂无物流信息 -->
		<view class="d-flex a-center j-center py-5"><text class="font-md text-light-muted">暂无物流信息</text></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			order_id: 0,
			list: []
		};
	},
	onLoad(e) {
		if (!e.detail) {
			uni.showToast({
				title: '非法参数',
				icon: 'none'
			});
			return uni.navigateBack({
				delta: 1
			});
		}
		this.order_id = JSON.parse(e.detail).id;
		this.__init();
	},
	methods: {
		__init() {
			let arr = {
				1: '在途中',
				2: '派件中',
				3: '已签收',
				4: '派送失败(拒签等)'
			};
			this._api.get(`order/${this.order_id}/get_ship_info`, {}, { token: true }).then(res => {
				if (res.status == 101) {
					return uni.showToast({
						title: '物流' + res.msg,
						icon: 'none'
					});
				}
				let status = arr[res.result.deliverystatus];
				if (status) {
					uni.setNavigationBarTitle({
						title: status
					});
				}
				this.list = res.result.list;
			});
		}
	}
};
</script>

<style></style>
