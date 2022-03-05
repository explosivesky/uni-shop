<template>
	<view>
		<view class="px-2 animated fadeIn faster">
			<uni-nav-bar title="购物车" @clickRight="isEdit" :statusBar="true" :shadow="false" :rightText="edit&&GoodsCartCount!==0 ? '完成' : '编辑'"></uni-nav-bar>
			<view v-if="disabledSelectAll" class="py-5 d-flex border-bottom">
				<view class="flex-1 d-flex j-center text-light-muted">
					<text class="iconfont icon-gouwuche mr-2 font-md"></text>
					<text class="mr-2">购物车为空</text>
					<text style="color: #000000;" @click="switchTo">去逛逛</text>
				</view>
			</view>
			<!-- 购物车列表 -->
			<view class="d-flex a-center border-bottom" style="height: 265rpx;" v-for="(item, index) in list" :key="index">
				<view class="d-flex j-sb a-center flex-shrink mr-2">
					<label class="radio" style="margin-right: 25rpx;" @click="selectItem(index)"><radio :value="item.id" color="#fd6801" :checked="item.checked" /></label>
					<view class="border" style="height: 190rpx; width: 190rpx;">
						<image :src="item.cover" class="p-2" style="height: 150rpx; width: 150rpx;"></image>
					</view>
				</view>
				<view class="d-flex flex-column flex-1 j-start">
					<view class="font-md">{{ item.title }}</view>
					<!-- 编辑 sku -->
					<view class="font text-light-muted d-flex a-center mb-2 px-1-5 rounded" v-if="item.skus_type" @click.stop="doShowPopupFn(item,index,edit)" :class="edit ? 'bg-light-secondary' : ''">
						<!-- <text class="mr-1" v-for="(attrs, attrsIndex) in item.attrs">{{ attrs.list[attrs.selected].name }}</text> -->
						<text class="mr-1">{{ item.skusText}}</text>
						<view class="iconfont icon-bottom ml-auto line-h1 font-sm" v-if="edit"></view>
					</view>
					<view class="d-flex j-sb mb-2">
						<price priceSize="font-md">{{ item.pprice }}</price>
						<uni-number-box :min="item.minnum" :max="item.maxnum" :value.sync="item.num" @change="changeNum($event,item,index)"/>
					</view>
				</view>
			</view>
		</view>

		<!-- 热门推荐 -->
		<banner-text />
		<!-- 公共列表 -->
		<view class="row j-sb " style="width: 750rpx;"><common-list v-for="(item, index) in common_list" :key="index" :item="item" :index="index"></common-list></view>

		<!-- 占位 -->
		<view style="height: 100rpx;"></view>
		<!-- 合计 -->
		<view class="position-fixed d-flex left-0 right-0 bottom-0 font-md bg-white" style="height: 100rpx; z-index: 1555;" v-if="!edit&&GoodsCartCount!==0">
			<view class="px-5 d-flex flex-shrink a-center">
				<label><checkbox color="#fd6801" @click="doSelectAll" :checked="isAll" :disabled="disabledSelectAll"></checkbox></label>
			</view>
			<view class="flex-1 d-flex a-center j-center">
				<text>合计 :</text>
				<price class="ml-1 main-text-color line-h-sm">{{ totalPrice }}</price>
			</view>
			<view class="flex-1 d-flex a-center main-bg-color j-center text-white" hover-class="main-bg-hover-color" @click="orderConfirm"><text>结算</text></view>
		</view>
		<!-- 编辑状态 -->
		<template v-if="edit&&GoodsCartCount!==0">
			<view class="position-fixed d-flex left-0 right-0 bg-white bottom-0 font-md" style="height: 100rpx; z-index: 1555;">
				<view class="px-5 d-flex flex-shrink a-center">
					<label><checkbox color="#fd6801" @click="doSelectAll" :checked="isAll" :disabled="disabledSelectAll"></checkbox></label>
				</view>
				<view class="flex-1 d-flex a-center j-center text-white" style="background-color: #fd6801;"><text>移入收藏</text></view>
				<view class="flex-1 d-flex a-center j-center text-white" style="background-color: #de5900;" hover-class="delete-hover" @click="deleteAction">
					<text>删除</text>
				</view>
			</view>
		</template>
		<!-- 弹出框规格 -->
		<sku-popup/>
		<my-loading :beforeReady="beforeReady" />
	</view>
</template>

<script>
import price from '@/components/common/price.vue';
import uniNumberBox from '@/components/uni-ui/uni-number-box/uni-number-box.vue';
import card from '@/components/common/card.vue';
import radioGroups from '@/components/common/radio-groups.vue';
import commonList from '@/components/common/common-list.vue';
import bannerText from '@/components/common/banner-text.vue';
import skuPopup from '@/components/card/sku-popup.vue';
import myLoading from '@/mixins/my-loading.js';

import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
export default {
	mixins: [myLoading],
	data() {
		return {
			edit: false,
			common_list: [],
			img:[
				'/static/images/demo/cate_01.png',
				'/static/images/demo/cate_02.png',
				'/static/images/demo/cate_03.png',
				'/static/images/demo/cate_04.png'
				]
		};
	},
	//监听页面返回
	onBackPress() {
		//模态框打开状态
		if (this.$store.state.cartModule.popupShow !== 'none') {
			this.$store.state.cartModule.popupShow = 'none';
			//组织页面返回
			return true;
		}
	},
	computed: {
		...mapState('cartModule', {
			list: state => state.list,
			popupShow: state => state.popupShow,
			selectList: state => state.selectList,
		}),
		...mapGetters('cartModule', ['isAll', 'totalPrice', 'disabledSelectAll', 'getCartInfo','GoodsCartCount'])
	},
	onShow() {
		this.__init();
	},
	onUnload() {
		uni.$off('updateCart',()=>{})
	},
	onPullDownRefresh() {
		this.__init(true)
	},
	components: {
		price,
		uniNumberBox,
		card,
		radioGroups,
		commonList,
		bannerText,
		skuPopup
	},
	mounted() {
		this.beforeReady = false;
	},
	methods: {
		...mapMutations('cartModule', ['selectItem','initCartData','unSelectAll']),
		...mapActions('cartModule', ['doSelectAll', 'deleteAction', 'doHidePopup', 'doShowPopup','updateCartData']),
		__init(refresh=false) {
			//在vuex 中请求购物车信息
			this.updateCartData(refresh).then(res=>{
				uni.stopPullDownRefresh()
			}).catch(err=>{
				uni.stopPullDownRefresh()
			})
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
		},
		//打开sku 组件时，请求获取 sku 数据
		doShowPopupFn(item,index,edit){
			if(this.edit===false)return
			this._api.get(`cart/${item.id}/sku`,{},{token:true}).then(res=>{
				//生成商品规格的数据类型
				/*
				{
					id:0,
					title:'0',
					selected:0,
					list:[{
						id:0,
						name:''
					}]
				}
				*/
			   //根据 skusText 默认选中 sku
			   let arr = item.skusText.split(',')
				res.selects=res.goods_skus_card.map((v,v_i)=>{
					let selected = 0
				 let list=v.goods_skus_card_value.map((j,j_i)=>{
					 if(arr[v_i]==j.value)selected = j_i
					 return {
						 id :j.id,
						 name : j.value
					 }
				})
				return {
					id:v.id,
					title:v.name,
					selected,
					list
				}
			})
			//每个规格生成 skuText 字段
			res.goods_skus.forEach((item,index)=>{
				//生成模拟 sku 对应的商品图片
				item.image = this.img[index]
				let arr = []
				for(let key in item.skus){
					arr.push(item.skus[key].value)
				}
				item.skuText = arr.join(',')
			})
				//通过 vuex 传给 sku popup 组件
				this.doShowPopup({skuList:res,index,edit})
			})
		},
		//购物车商品数量变化时
		changeNum(e,item,index){
			if(e===item.num)return
			uni.showLoading({
				title: '加载中'
			});
			this._api.post(`cart/updatenumber/${item.id}`,{num:e},{token:true}).then(res=>{
				uni.hideLoading()
			})
		},
		//购物车是否编辑状态
		isEdit() {
			if(this.GoodsCartCount===0)return
			this.edit = !this.edit;
		},
		//结算
		orderConfirm() {
			if(this.selectList.length==0){
				return uni.showToast({
					title: '请选择要结算的商品',
					icon:'none'
				});
			}
			uni.navigateTo({
				url: '/pages/order-confirm/order-confirm?selectList='+JSON.stringify(this.selectList)
			});
		},
		//跳转首页
		switchTo(){
			uni.switchTab({
				url:'/pages/index/index'
			})
		}
	}
};
</script>

<style scoped>
.delete-hover {
	background-color: #ca5100 !important;
}
</style>
