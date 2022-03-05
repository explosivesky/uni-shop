<template>
	<view>
		<!-- 支付金额 -->
		<view class="d-flex a-center j-center" style="margin: 60rpx; 0">
			<view class="d-flex flex-column j-center a-center">
				<text class="font-sm text-light-muted text-center mb-3">支付金额</text>
				<price uniSize="font" priceSize="font-md" class="ml-2">{{ detail.totalPrice }}</price>
			</view>
		</view>
		<!-- 支付方式 -->
		<view class="px-3">
			<radio-group @change="payChange">
				<label v-for="(item, index) in payData" :key="index">
					<uni-list-item :leftIcon="item.icon" :iconColor="item.color" leftIconSize="60rpx">
						<view class="d-flex flex-column" style="margin-left: -30rpx;">
							<view>{{ item.title }}</view>
							<view class="text-light-muted" v-if="item.note">{{ item.note }}</view>
						</view>
						<radio slot="icon" :checked="item.value===payMethods" :value="item.value" color="#ff7d00" />
					</uni-list-item>
				</label>
			</radio-group>
			<!-- 确认支付 -->
			<view class="main-bg-hover-color text-white rounded py-2 d-flex a-center j-center mt-3" hover-class="main-bg-color" @click="pay"><text>确认支付</text></view>
		</view>
	</view>
</template>

<script>
import price from '@/components/common/price.vue';
import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue';
export default {
	data() {
		return {
			payMethods: 'alipay',
			detail: {
				id: 0,
				totalPrice: 0
			},
			payData: [
				{
					title: '支付宝支付',
					icon: 'icon-zhifubao',
					color: '#0072ff',
					note: '推荐使用支付宝',
					value: 'alipay'
				},
				{
					title: '微信支付',
					icon: 'icon-weixinzhifu',
					color: '#11873d',
					note: '',
					value: 'wxpay'
				}
			]
		};
	},
	components: {
		price,
		uniListItem
	},
	onLoad(e) {
		if (!e.detail) {
			return uni.showToast({
				title: '支付失败',
				icon: 'none'
			});
		}
		this.detail = JSON.parse(e.detail);
	},
	methods: {
		pay() {
			if (this.payMethods == '') {
				return uni.showToast({
					title: '请选择支付方式',
					icon: 'none'
				});
			}
			uni.showLoading({
				title: '请稍后...',
				mask: true
			});
			this._api
				.get(`payment/${this.detail.id}/${this.payMethods}`, {}, { token: true, native: true })
				.then(res => {
					uni.hideLoading();
					//支付 api
					uni.requestPayment({
				  provider: this.payMethods, //支付方式
						orderInfo: res.data, //微信、支付宝订单数据 【注意微信的订单信息，键值应该全部是小写，不能采用驼峰命名】
						success: res => {
							//重定向/防止重复支付 跳转支付结果页面
							uni.redirectTo({
								url: '/pages/pay-result/pay-result'
							});
						},
						fail: err => {
							return uni.showToast({
								title: '支付失败',
								icon: 'none'
							});
						}
					});
				})
				.catch(err => {
					uni.hideLoading();
					uni.showToast({
						title: '支付失败',
						icon: 'none'
					});
				});
			return;
			uni.redirectTo({
				url: '/pages/order-confirm/order-confirm'
			});
		},
		payChange(e) {
			this.payMethods = e.target.value;
		}
	}
};
</script>

<style></style>
