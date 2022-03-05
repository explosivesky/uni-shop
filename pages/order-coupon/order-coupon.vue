<template>
	<view class="d-flex flex-column" style="height: 100%;">
		<!-- 菜单栏 -->
		<view class="d-flex border-top text-light-muted p-0 m-0 position-fixed top-0 left-0 right-0" style="height: 85rpx; z-index: 300; background-color: #ffffff;">
			<text
				class="flex-1 d-flex py-3 border-bottom a-center j-center"
				@click="tabBarFn(index)"
				:class="{ 'tab-active': index === tabIndex }"
				v-for="(item, index) in tabBars"
				:key="index"
			>
				{{ item.name }}
			</text>
		</view>
		<view style="height: 85rpx;"></view>
		<!-- 优惠券列表模块 -->
		<scroll-view scroll-y class="flex-1" style="background-color: #f5f5f5 !important;">
			<block v-for="(tabItem, tabI) in tabBars" :key="tabI">
				<view v-show="tabIndex === tabI">
					<template v-if="tabItem.list.length > 0">
						<view class="p-3">
							<block v-for="(item, index) in tabItem.list" :key="index">
								<coupon :item="item" :index="index" @click.native="useCoupon(item)">
									<text v-if="item.disabled">已使用</text>
									<text v-else>{{item.status ? '去使用' : validText}}</text>
								</coupon>
							</block>
						</view>
					</template>
					<!-- no-thing -->
					<template v-else>
						<no-thing :noThingImgSrc="tabItem.no_thing" :noThingText="tabItem.msg" />
					</template>
				</view>
			</block>
		</scroll-view>
	</view>
</template>

<script>
import orderList from '@/components/order/order-list.vue';
import noThing from '@/components/common/no-thing.vue';
import coupon from '@/components/order-coupon/coupon.vue';
export default {
	data() {
		return {
			tabIndex: 0,
			totalPrice:0,
			tabBars: [
				{
					name: '可用',
					no_thing: 'no_pay',
					msg: '您还没有可用的优惠券',
					page:1,
					key:'valid',
					firstLoad:false,//防止重复加载 false 没加载过 true 以加载
					list: [{
						id:12,
						title:'5满0.05打5折',
						start_time:1568478825,
						end_time:1578745662,
						price:'5.00',
						desc:'满减',
						status:true,//false 已失效
						disabled:false,//true 已领取
						type:0//0固定金额 1打折
					},
					{
						id:13,
						title:'7折优惠券',
						start_time:1568478825,
						end_time:1578745662,
						price:'7.00',
						desc:'折扣',
						status:false,//false 已失效
						disabled:false,//true 已领取
						type:1//0固定金额 1打折
					}]
				},
				{
					name: '已失效',
					no_thing: 'no_pay',
					msg: '您还没有优惠券',
					page:1,
					key:'invalid',
					firstLoad:false,//防止重复加载 false 没加载过 true 以加载
					list: []
				}
			]
		};
	},
	components: {
		noThing,
		orderList,
		coupon
	},
	onLoad(e) {
		let totalPrice=0
		if(e.totalPrice){
			totalPrice=JSON.parse(e.totalPrice)
		}
		this.totalPrice = totalPrice
		this.__init()
	},
	computed:{
		//获取分页
		getPage(){
			return this.tabBars[this.tabIndex].page
		},
		//是否可用
		isValid(){
			return this.tabBars[this.tabIndex].key
		},
		//根据 tabbar 判断优惠券是 不可用 还是 已失效
		validText(){
			return this.tabIndex === 0 ? '不可用' : '已失效'
		}
	},
	methods: {
		__init(){
			//请求前保存索引
			//防止网速过慢时，用户切换tabindex
			let index = this.tabIndex
			this._api.get(`usercoupon/${this.getPage}/${this.isValid}`,{},{token:true}).then(res=>{
				// this.tabBars[index].list = res.map(v=>{
				this.tabBars[index].list = res.map(v=>{
					//如果第一个 tab 栏中 使用条件不符合
					let status = (index===0) && (v.min_price <= parseFloat(this.totalPrice))
					return{
						id:v.coupon.id,
						title:v.coupon.name,
						start_time:v.coupon.start_time,
						end_time:v.coupon.end_time,
						price:v.coupon.value,
						desc:v.coupon.desc,
						status,//false 已失效
						disabled:v.used ===0 ? false : true,//true 已领取
						type:v.coupon.type//0固定金额 1打折
					}
				})
				this.tabBars[index].firstLoad=true
			})
		},
		tabBarFn(index) {
			this.tabIndex = index;
			//还没加载
			if(!this.tabBars[index].firstLoad){
				this.__init()
			}
		},
		//选择优惠券
		useCoupon(item){
			//已使用
			if(item.disabled){
				return uni.showToast({
					title: '该优惠券已经使用过了',
					icon:'none'
				});
			}
			//已失效/不可用
			if(!item.status){
				return uni.showToast({
					title: `该优惠券已经${this.validText}了`,
					icon:'none'
				});
			}
			uni.$emit('useCoupon',{
					id:item.id,
					price:item.price,
					type:item.type
			})
			uni.navigateBack({
				delta: 1
			});
		}
	}
};
</script>

<style scoped>
.tab-active {
	color: #ff791a;
	border-width: 2rpx;
	border-color: #ff791a;
}
</style>
