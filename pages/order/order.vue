<template>
	<view>
		<!-- 菜单栏 -->
		<view class="d-flex border-top text-light-muted p-0 m-0 position-fixed top-0 left-0 right-0" style="height: 85rpx; z-index: 300; background-color: #ffffff;">
			<text
				class="flex-1 d-flex py-3 border-bottom a-center j-center"
				@click="tabBarFn(index)"
				:class="{ 'tab-active': index == tabIndex }"
				v-for="(item, index) in tabBars"
				:key="index"
			>
				{{ item.name }}
			</text>
		</view>
		<view style="height: 85rpx;"></view>
		<!-- 订单列表模块 -->
		<block v-for="(tabItem, tabI) in tabBars" :key="tabI">
			<view v-show="tabIndex == tabI">
				<template v-if="tabItem.list.length > 0">
					<block v-for="(item, index) in tabItem.list" :key="index">
						<!-- 订单列表 -->
						<order-list :item="item" :index="index" @update="__init"/>
					</block>
				</template>
				<!-- no-thing -->
				<template v-else>
					<no-thing :noThingImgSrc="tabItem.no_thing" :noThingText="tabItem.msg" />
				</template>
			</view>
		</block>
		<banner-text title="猜你喜欢" titleTow="实时推荐你的爱" />
		<view class="row j-sb"><common-list class="" v-for="(item, index) in common_list" :key="index" :item="item" :index="index"></common-list></view>
		<my-loading :beforeReady="beforeReady"></my-loading>
	</view>
</template>

<script>
import bannerText from '@/components/common/banner-text.vue';
import commonList from '@/components/common/common-list.vue';
import noThing from '@/components/common/no-thing.vue';
import divider from '@/components/common/divider.vue';
import orderList from '@/components/order/order-list.vue';

import mixin from '@/mixins/my-loading.js'
export default {
	mixins:[mixin],
	data() {
		return {
			tabIndex: 0,
			common_list: [],
			tabBars: [
				{
					name: '全部',
					no_thing: 'no_pay',
					msg:'您还没有订单',
					key:'all',
					list:[]
				},
				{
					name: '待支付',
					no_thing: 'no_pay',
					msg:'您还没有待付款订单',
					key:'paying',
					list:[]
				},
				{
					name: '待收货',
					no_thing: 'no_receiving',
					msg:'您还没有待收货订单',
					key:'receiving',
					list:[]
				},
				{
					name: '待评价',
					no_thing: 'no_comment',
					msg:'您还没有待评价订单',
					key:'reviewing',
					list:[]
				}
			]
		};
	},
	components: {
		bannerText,
		commonList,
		noThing,
		divider,
		orderList
	},
	onLoad(e){
		if(e.index){
			this.tabBarFn(e.index)
		}
	},
	onShow(){
		this.commonListData()
		this.__init()
	},
	computed:{
		getOrderType(){
			return this.tabBars[this.tabIndex].key
		}
	},
	methods: {
		tabBarFn(index) {
			this.tabIndex = index;
			this.__init()
		},
		__init(){
			this.beforeReady=true
			//获取对应订单状态下的订单
			let index = this.tabIndex
			this._api.post(`order/${this.getOrderType}`,{},{token:true}).then(res=>{
				this.tabBars[index].list = res.map(v=>{
					let order_items=v.order_items.map(o=>{
						let attrs = []
						if(o.skus_type > 0 &&o.goods_skus&&o.goods_skus.skus){
							for(let key in o.goods_skus.skus){
								attrs.push(o.goods_skus.skus[key].value)
							}
						}
						return{
							goods_id:o.goods_item.id,
							cover:o.goods_item.cover,
							title:o.goods_item.title,
							pprice:o.price,
							attrs:attrs.join(','),
							num:o.num
						}
					})
					return {
						id:v.id,//订单 id
						create_time:v.create_time,
						status:this.$U.formatStatus(v),
						totalPrice:v.total_price,
						order_items
					}
				})
				this.beforeReady=false
			})
		},
		commonListData(){
			//请求热门推荐
			this._api.get('goods/hotlist',{},{toast:true}).then(res => {
				this.common_list = res.map(v => {
					return {
						id: v.id,
						cover: v.cover,
						title: v.title,
						desc: v.desc,
						oprice: v.min_oprice,
						pprice: v.min_price
					};
				});
			})
		}
	}
};
</script>

<style>
.tab-active {
	color: #ff791a;
	border-width: 2rpx;
	border-color: #ff791a;
}
</style>
