<template>
	<view>
		<view class="main-bg-color" style="height: 100rpx;"></view>
		<!-- 头部 -->
		<view class="main-bg-color d-flex j-sb a-center text-white px-3" style="height: 230rpx;">
			<view class="d-flex flex-column">
				<text class="font-md">{{ status }}</text>
				<text class="font-sm">{{timeDownText}}</text>
			</view>
			<view class="iconfont icon-daishouhuo" style="font-size: 100rpx;"></view>
		</view>
		<!-- 收货人信息 -->
		<view class="p-3 d-flex flex-column a-start j-sb font text-light-muted">
			<view class="d-flex a-center">
				<text class="font-md text-dark mr-2">{{ address.name }}</text>
				<text>{{ address.phone }}</text>
			</view>
			<view>{{ path }}</view>
		</view>
		<divider />
		<!-- 订单列表 -->
		<view v-for="(order_items, order_index) in orderItems"><order-list-item :order_items="order_items" :order_index="order_index" /></view>
		<divider />
		<uni-list-item title="商品总价" titleColor="text-light-muted" :rightText="'￥' + price" rightTextColor="text-light-muted" />
		<uni-list-item title="快递" titleColor="text-light-muted" rightText="包邮" rightTextColor="text-light-muted" />
		<uni-list-item title="优惠券" titleColor="text-light-muted" :rightText="coupon" rightTextColor="text-light-muted" />
		<uni-list-item title="实际付款" titleColor="main-text-color" :rightText="'￥' + price" rightTextColor="main-text-color" />
		<divider />
		<card headTitle="订单信息" :showBorderBottom="false" :showCover="false"><uni-list-item title="订单编号" :rightText="no" rightTextColor="text-light-muted" /></card>
		<!-- 底部其他按钮 -->
		<view style="height: 100rpx;" v-if="status==='待支付' || status==='待发货' || status==='待收货'"></view>
		<view class="position-fixed d-flex a-center j-end px-3 left-0 right-0 bottom-0" v-if="status==='待支付' || status==='待发货' || status==='待收货'" style="height: 100rpx; z-index: 1000; background-color: #f8f9fb;">
			<template v-if="status==='待支付'">
				<common-button @click="openPayment">去支付</common-button>
				<common-button @click="closeOrder">取消订单</common-button>
			</template>
			<template v-else-if="status==='待发货'">
				<common-button>提醒发货</common-button>
				<common-button @click="applyRefund">申请退款</common-button>
			</template>
			<template v-else-if="status==='待收货'">
				<common-button @click="openLogistics">查看物流</common-button>
				<common-button @click="received">确认收货</common-button>
			</template>
		</view>
	</view>
</template>

<script>
import divider from '@/components/common/divider.vue';
import orderListItem from '@/components/order/order-list-item.vue';
import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue';
import card from '@/components/common/card.vue';
import commonButton from '@/components/order/common-button.vue';

import $T from '@/common/time.js'
var timer = null
export default {
	data() {
		return {
			order_id: 0,
			id: 0,
			no: '',
			address: {
				province: '',
				city: '',
				district: '',
				address: '',
				zip: null,
				name: '',
				phone: ''
			},
			total_price: 0,
			remark: '',
			paid_time: null,
			payment_method: '',
			payment_no: '',
			refund_status: '',
			ship_status: '',
			extra: null,
			create_time: '',
			update_time: '',
			reviewed: 0,
			orderItems: [],
			couponUserItem: [],
			timeDown:'',
			end_time:0
		};
	},
	onLoad(e) {
		if (!e.id) {
			uni.showToast({
				title: '订单不存在',
				icon: 'none'
			});
			return uni.navigateBack({
				delta: 1
			});
		}
		this.order_id = e.id;
		this.__init();
	},
	components: {
		divider,
		orderListItem,
		uniListItem,
		card,
		commonButton
	},
	computed: {
		//拼接地址
		path() {
			let { province, city, district, address } = this.address;
			return `${province} ${city} ${district} ${address}`;
		},
		//自动生成订单状态
		status() {
			return this.$U.formatStatus({
				paid_time: this.paid_time,
				refund_status: this.refund_status,
				ship_status: this.ship_status
			});
		},
		//根据状态自动生成订单状态信息
		timeDownText() {
			let msg = '';
			switch (this.status) {
				case '待支付':
					msg = '取消';
					break;
				case '待收货':
					msg = '确认';
					break;
				case '待发货':
					return '等待商家发货';
					break;
				case '退款中':
					return '等待商家审核';
					break;
				case '已签收':
					return '订单已签收';
					break;
			}
			if (msg !== '' && this.timeDown !== '') {
				return `还差 ${this.timeDown} 自动${msg}`;
			}
			return '';
		},
		// 实现优惠券功能
		coupon(){
			if(Array.isArray(this.couponUserItem)&&this.couponUserItem.length===0)return '未使用'
			let {type,value} = this.couponUserItem.coupon
			if(type===0){
				return '-￥'+value
			}else{
				return '打'+value+'折'
			}
		},
		//实际付款
		price(){
			let totalPrice = 0
			this.orderItems.forEach(i=>{
				totalPrice += i.pprice * i.num
			})
			return totalPrice.toFixed(2)
		}
	},
	methods: {
		//开启定时器
		getDate(){
			if(this.status==='待支付'||this.status==='待收货'){
				if(timer)clearInterval(timer)
				timer = setInterval(()=>{
					let now = (new Date().getTime())/1000
					//未支付状态下 如果下单时间小于当前时间则自动取消订单
					if(this.end_time < (now)){
						uni.switchTab({
							url:'/pages/index/index'
						})
						uni.showToast({
							title: this.status === '待支付' ? '订单已关闭' : '订单已确认',
							icon:'none'
						});
						this.timeDown=''
						return clearInterval(timer)
					}
					//生成倒计时
					this.timeDown = $T.timeDown(this.end_time)
				},1000)
			}
		},
		__init() {
			//获取订单详情数据
			this._api.get(`order/${this.order_id}`, {}, { token: true }).then(res => {
				let orderItems = res.orderItems.map(o => {
					let attrs = [];
					if (o.goodsItem.sku_type > 0 && o.goodsSkus && o.goodsSkus.skus) {
						for (let key in o.goodsSkus.skus) {
							attrs.push(o.goodsSkus.skus[key].value);
						}
					}
					return {
						goods_id: o.goodsItem.id,
						cover: o.goodsItem.cover,
						title: o.goodsItem.title,
						pprice: o.price,
						attrs: attrs.join(','),
						num: o.num
					};
				});
				this.id = res.id;
				this.no = res.no;
				this.address = res.address;
				this.total_price = res.total_price;
				this.remark = res.remark;
				this.paid_time = res.paid_time;
				this.payment_method = res.payment_method;
				this.payment_no = res.payment_no;
				this.refund_status = res.refund_status;
				this.ship_status = res.ship_status;
				this.extra = res.extra;
				this.create_time = res.create_time;
				this.update_time = res.update_time;
				this.reviewed = res.reviewed;
				this.orderItems = orderItems;
				this.couponUserItem = res.couponUserItem;
				this.end_time = res.end_time ? res.end_time : 0
				//开启定时器
				this.getDate()
			});
		},
		//去支付
		openPayment(){
			//获取订单 id  和 总价格
			let detail={id:this.id,totalPrice:this.price}
			this.navigateTo({
				url:"/pages/pay-method/pay-method?detail="+JSON.stringify(detail)
			})
		},
		//取消订单
		closeOrder(){
			uni.showModal({
				content: '是否取消订单?',
				success: res => {
					if(res.confirm){
						uni.showLoading({
							title: '取消订单中...',
							mask: false
						});
						this._api.post(`closeorder/${this.id}`,{},{token:true}).then(res=>{
							uni.hideLoading()
							uni.navigateBack({
								delta:1
							})
							uni.showToast({
								title: '取消成功',
								icon:'none'
							});
						}).catch(err=>{
							uni.hideLoading()
						})
					}
				}
			});
		},
		//申请退款
		applyRefund(){
			//获取订单 id
			let detail={id:this.id}
			this.navigateTo({
				url:"/pages/order-refound/order-refound?detail="+JSON.stringify(detail)
			})
		},
		//查看物流
		openLogistics(){
			//获取订单 id
			let detail={id:this.id}
			uni.navigateTo({
				url:"/pages/logistics/logistics?detail="+JSON.stringify(detail)
			})
		},
		// 售后服务
		openAfterSale(){
			uni.navigateTo({
				url:"/pages/after-sale/after-sale"
			})
		},
		//确认收货
		received(){
			uni.showModal({
				content: '是否确认收货?',
				success: res => {
					if(res.confirm){
						uni.showLoading({
							title: '确认收货中...',
							mask: false
						});
						this._api.post(`order/${this.id}/received`,{},{token:true}).then(res=>{
							uni.hideLoading()
							uni.navigateBack({
								delta:1
							})
							uni.showToast({
								title: '确认收货成功',
								icon:'none'
							});
						}).catch(err=>{
							uni.hideLoading()
						})
					}
				}
			});
		}
	}
};
</script>

<style></style>
