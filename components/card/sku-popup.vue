<template>
	<!-- sku 弹出框 -->
	<common-popup :popupClass="popupShow" @hide="doHidePopup">
		<view class="d-flex a-center" style="height: 270rpx;">
			<image :src="showSkuImag" mode="widthFix" style="height: 180rpx; width: 180rpx;"></image>
			<view class="pl-2 flex-1">
				<price :fontWeight="true" priceSize="font-lg" class="line-h-sm">{{showPrice}}</price>
				<text class="line-h-sm mr-2">{{ getSelectSku}}</text>
			</view>
		</view>
		<scroll-view scroll-y class="border-bottom" style="height: 560rpx;">
			<card
				:headTitle="attr.title"
				:showCover="false"
				:showBorderBottom="false"
				:titleWeight="false"
				v-for="(attr, attrIndex) in skuList.selects"
				:key="attrIndex"
			>
				<radio-groups :label="attr" :selected.sync="attr.selected"></radio-groups>
			</card>
		</scroll-view>
		<view class="d-flex j-sb a-center" style="height: 129rpx;">
			<view class="font">购买数量</view>
			<uni-number-box :max="getCartInfo.maxnum" :min="getCartInfo.minnum" :value.sync="getCartInfo.num"></uni-number-box>
		</view>
		<view class="main-bg-color text-white d-flex a-center j-center" @click.stop="confirm" style="margin-left: -4.3%; margin-right: -4%; height: 100rpx;" hover-class="main-bg-hover-color">
			确定
		</view>
	</common-popup>
</template>

<script>
	import uniNumberBox from '@/components/uni-ui/uni-number-box/uni-number-box.vue';
	import price from '@/components/common/price.vue';
	import commonPopup from '@/components/common/common-popup.vue';
	import radioGroups from '@/components/common/radio-groups.vue';
	import card from '@/components/common/card.vue';
	
	import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
	export default{
		data(){
			return{
			}
		},
		computed:{
			...mapState('cartModule', {
				skuList: state => state.skuList,
				popupShow: state => state.popupShow
			}),
			...mapGetters('cartModule', ['isAll', 'totalPrice', 'disabledSelectAll', 'getCartInfo']),
			showSkuImag(){
				if(this.skuList.length===0) return
				let index = this.checkedSkusIndex
				if(index !== -1){
					return this.skuList.goods_skus[index].image
				}
			},
			//根据选中sku 和 detail 中的 skuText 匹配，并获取对应 sku 中的价格
			showPrice(){
				if(this.skuList.length===0) return
				let index = this.checkedSkusIndex
				//没选 sku 规格就显示基础价格
				if(index === -1){
					return this.skuList.min_oprice || 0.00
				}
				//选中了 就根据匹配的 sku 的 index 获取对应 sku 的价格
				return this.skuList.goods_skus[index].cprice
			},
			//获取选中的 sku 配置
			getSelectSku(){
				if(this.skuList.length===0) return
				 let checkSku = this.skuList.selects.map(v=>{
					   return v.list[v.selected].name
					})
				//转换为 字符串并返回
				return checkSku.join(',')
			},
			//根据 skuText 和 sku配置匹配获取 index
			checkedSkusIndex(){
				if(this.skuList.length===0) return
				let index =  this.skuList.goods_skus.findIndex(v=>{
					return v.skuText === this.getSelectSku
				})
				return index
			},
			//获取选中 skuid
			skuId(){
				if(this.skuList.length===0) return
				return this.skuList.goods_skus[this.checkedSkusIndex].id
			}
		},
		components: {
			price,
			uniNumberBox,
			commonPopup,
			radioGroups,
			card
		},
		methods:{
			...mapActions('cartModule', ['doHidePopup','updateCartData']),
			confirm(){
				this._api.post(`cart/${this.skuId}`,{num:this.getCartInfo.num}).then(async res=>{
					await this.updateCartData()
					uni.showToast({
						title: '修改成功',
						icon:'none'
					});
				}).catch(err=>{
					uni.showToast({
						title: '修改失败',
						icon:'none'
					});
				})
			}
		},
	}
</script>

<style>
</style>
