<template>
	<view class="text-light-muted font">
		<divider />
		<!-- 订单日期 -->
		<view class="d-flex a-center border-bottom j-sb py-3">
			<text class="px-2">{{item.create_time}}</text>
			<text class="main-text-color px-2">{{item.status}}</text>
		</view>
		<!-- 订单列表 -->
		<view v-for="(order_items,order_index) in item.order_items" @click.stop="openOrderDetail">
			<order-list-item :order_items="order_items" :order_index="order_index"/>
		</view>
		<!-- 商品总价 -->
		<view class="p-2 d-flex flex-column a-end j-sb font" style="height: 140rpx;">
			<view class="">共{{item.order_items.length}}件商品, 合计: ￥{{item.totalPrice}}</view>
			<view class="d-flex text-muted">
				<template v-if="item.status==='待支付'">
					<common-button @click="openPayment">去支付</common-button>
					<common-button @click="closeOrder">取消订单</common-button>
				</template>
				<template v-else-if="item.status==='待发货'">
					<common-button>提醒发货</common-button>
					<common-button @click="applyRefund">申请退款</common-button>
				</template>
				<template v-else-if="item.status==='待收货'">
					<common-button @click="openLogistics">查看物流</common-button>
					<common-button @click="received">确认收货</common-button>
				</template>
				<template v-else>
					<common-button @click="openOrderDetail">查看详情</common-button>
				</template>
			</view>
		</view>
	</view>
</template>

<script>
	import divider from '@/components/common/divider.vue';
	import orderListItem from '@/components/order/order-list-item.vue';
	import commonButton from '@/components/order/common-button.vue';
	export default{
		props:{
			item:Object,
			index:Number
		},
		components:{
			divider,
			orderListItem,
			commonButton
		},
		methods:{
			//去支付
			openPayment(){
				//获取订单 id  和 总价格
				let detail={id:this.item.id,totalPrice:this.item.totalPrice}
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
							this._api.post(`closeorder/${this.item.id}`,{},{token:true}).then(res=>{
								//通知父组件更新页面数据
								this.$emit('update')
								uni.hideLoading()
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
				let detail={id:this.item.id}
				this.navigateTo({
					url:"/pages/order-refound/order-refound?detail="+JSON.stringify(detail)
				})
			},
			//查看订单详情
			openOrderDetail(){
				this.navigateTo({
					url:"/pages/order-detail/order-detail?id="+this.item.id
				})
			},
			//查看物流
			openLogistics(){
				//获取订单 id
				let detail={id:this.item.id}
				uni.navigateTo({
					url:"/pages/logistics/logistics?detail="+JSON.stringify(detail)
				})
			},
			// 售后服务
			openAfterSale(){
				this.navigateTo({
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
							this._api.post(`order/${this.item.id}/received`,{},{token:true}).then(res=>{
								uni.hideLoading()
								//通知父组件更新页面数据
								this.$emit('update')
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
	}
</script>

<style>
</style>
