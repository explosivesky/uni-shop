<template>
	<view class="animated fadeIn faster" style="padding: 0 !important;">
		<!-- 商品详情大图 -->
		<swiper-image :resdata="banners" :height="750" preview></swiper-image>
		<!-- 基础详情 -->
		<base-info :detail="detail" :showPrice="showPrice"/>
		<!-- 滚动商品特性 -->
		<scroll-attr :baseAttr="baseAttr" />
		<!-- 属性选择 -->
		<view class="px-2 mt-3 mb-2">
			<view class="rounded border" style="background-color: #f5f5f3;">
				<!-- 规格 -->
				<uni-list-item @click="show('attr')" v-if="detail.sku_type === 1">
					<view class="d-flex a-center">
						<text class="line-h-sm mr-2">已选</text>
						<text class="text-light-muted line-h-sm">{{getSelectSku | formatStr}}</text>
					</view>
					<template #icon>
						<text class="iconfont icon-you text-light-muted"></text>
					</template>
				</uni-list-item>
				
				<!-- 优惠券 -->
				<uni-list-item @click="navToCoupon">
						<view class="d-flex a-center">
							<text class="mr-2">优惠券</text>
							<text class="main-text-color">马上领取</text>
						</view>
					<template #icon>
						<text class="iconfont icon-you text-light-muted"></text>
					</template>
				</uni-list-item>
				<!-- 配送地址 -->
				<uni-list-item @click="show('express')">
						<view class="d-flex a-center">
							<text class="line-h-sm">配送</text>
							<text class="ml-2 text-light-muted line-h-sm">{{getPath}}</text>
							<text class="ml-2 main-text-color line-h-sm">有现货</text>
						</view>
					<template #icon>
						<text class="iconfont icon-you text-light-muted"></text>
					</template>
				</uni-list-item>
				<!-- 其他信息 -->
				<uni-list-item extraWidth="8%" @click="show('service')">
						<view class="d-flex a-center">
							<view class="font text-muted d-flex">
								<view class="iconfont icon-finish  main-text-color mr-1"></view>
								小米自营
							</view>
							<view class="font text-muted d-flex mr-1">
								<view class="iconfont icon-finish main-text-color mr-1"></view>
								小米发货
							</view>
							<view class="font text-muted d-flex mr-1">
								<view class="iconfont icon-finish main-text-color mr-1"></view>
								七天无理由退款
							</view>
						</view>
					<template #icon>
						<text class="iconfont icon-you text-light-muted"></text>
					</template>
				</uni-list-item>
			</view>
		</view>

		<!-- 横向滚动评论 -->
		<scroll-comment :comments="comments" :goods_id="detail.id"/>
		
		

		<!-- 商品详情 -->
		<view class="border-top">
			<u-parse className="uparse" :content="context" @preview="preview" @navigate="navigate"></u-parse>
		</view>
		
		<!-- 热门推荐 -->
		<card headTitle="热门推荐" :titleWeight="false" :showBorderBottom="false" :showCover="false"></card>
		<view class="row j-sb">
			<common-list v-for="(item,index) in common_list" type="redirectTo" :key="index" :item="item" :index="index"></common-list>
		</view>
		
		<!-- 底部操作条 -->
		<bottom-btn @show="show('attr')"></bottom-btn>
		
		<!-- 弹出框规格 -->
		<common-popup :popupClass="popup.attr" @hide="hide('attr')">
			<view class="d-flex a-center" style="height: 270rpx;">
				
				<image :src="showSkuImag" style="height: 180rpx; width: 180rpx;"></image>
				<view class="pl-2 flex-1">
					<price :fontWeight="true" priceSize="font-lg" class="line-h-sm">{{showPrice}}</price>
					<text class="line-h-sm">{{getSelectSku | formatStr}}</text>
				</view>
			</view>
			<scroll-view scroll-y class="border-bottom" style="height: 560rpx;">
					<card :headTitle="item.title" :showCover="false" :showBorderBottom="false" :titleWeight="false" v-for="(item,index) in selects" :key="index">
						<radio-groups :label="item" :selected.sync="item.selected"></radio-groups>
					</card>
			</scroll-view>
			<view class="d-flex j-sb a-center" style="height: 129rpx;">
				<view class="font">购买数量</view>
				<uni-number-box :max="maxStock" :min="detail.minnum" :value.sync="detail.num"></uni-number-box>
			</view>
			<view class="text-white d-flex a-center j-center" 
			@click="addCartFn" style="margin-left: -4.3%; margin-right: -4%; height: 100rpx;" 
			:hover-class="maxStock > 0 ? 'main-bg-hover-color' : ''"
			:class="maxStock > 0 ? 'main-bg-color' : 'bg-secondary'">
				{{maxStock > 0 ? '加入购物车' : '暂无库存'}}
			</view>
		</common-popup>
		
		<!-- 弹出框收货地址 -->
		<common-popup :popupClass="popup.express" @hide="hide('express')">
			<view class="d-flex j-center a-center font-weight font-md" style="height: 100rpx;">收货地址</view>
			<scroll-view scroll-y class="border-top main-border-color" style="height: 835rpx;">
					<uni-list-item class="font-weight" style="margin: 0 -30rpx;" v-for="(item,index) in list" :key="index" @click.native="selectPath(item)">
						<view class="d-flex a-center">
							<view class="iconfont icon-dingwei mr-2"></view>{{item.name}}
						</view>
							<view class="text-light-muted font">{{item.path}}</view>
							<template #icon>
								<text class="iconfont icon-you text-light-muted"></text>
							</template>
					</uni-list-item>
			</scroll-view>
			<view class="main-bg-color text-white d-flex a-center j-center" style="margin-left: -4.3%; margin-right: -4%; height: 100rpx" @click="addPath" hover-class="main-bg-hover-color">
				选择新地址
			</view>
		</common-popup>
		
		<!-- 弹出框服务说明 -->
		<common-popup :popupClass="popup.service" @hide="hide('service')">
			<view class="d-flex j-center a-center font-weight font-md" style="height: 100rpx;">服务说明</view>
			<scroll-view scroll-y class="border-top main-border-color" style="height: 835rpx;">
				<view class="font-md my-2">
					<view class="d-flex">
						<view class="iconfont icon-finish main-text-color ml-1"></view>小米自营
					</view>
					<text class="font-sm text-light-muted ml-4">不管满多少，就是不包邮</text>
				</view>
			</scroll-view>
			<view class="main-bg-color text-white d-flex a-center j-center" style="margin-left: -4.3%; margin-right: -4%; height: 100rpx" hover-class="main-bg-hover-color">
				确定
			</view>
		</common-popup>
		<my-loading :beforeReady="beforeReady"/>
	</view>
</template>

<script>
import swiperImage from '@/components/index/swiper-image.vue';
import baseInfo from '@/components/detail/base-info.vue';
import scrollAttr from '@/components/detail/scroll-attr.vue';
import scrollComment from '@/components/detail/scroll-comment.vue';
import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue';
import uParse from '@/components/uni-ui/uParse/src/wxParse.vue';
import card from '@/components/common/card.vue';
import commonList from '@/components/common/common-list.vue';
import bottomBtn from '@/components/detail/bottom-btn.vue';
import commonPopup from '@/components/common/common-popup.vue';
import price from '@/components/common/price.vue';
import radioGroups from '@/components/common/radio-groups.vue';
import uniNumberBox from '@/components/uni-ui/uni-number-box/uni-number-box.vue';
import myLoading from "@/mixins/my-loading.js"

import {mapMutations,mapState,mapGetters,mapActions} from 'vuex'
export default {
	mixins:[myLoading],
	data() {
		return {
			popup:{
				attr:'none',
				express:'none',
				service:'none'
			},
			selects:[],
			banners: [],
			detail: {},
			baseAttr: [],
			comments: [],
			common_list:[],
			context: '',
			path:{
				province: "北京市",
				city: "市辖区",
				district: "东城区",
			},
			img:[
				'/static/images/demo/cate_01.png',
				'/static/images/demo/cate_02.png',
				'/static/images/demo/cate_03.png',
				'/static/images/demo/cate_04.png'
				]
		};
	},
	components: {
		swiperImage,
		baseInfo,
		scrollAttr,
		scrollComment,
		uniListItem,
		uParse,
		card,
		commonList,
		bottomBtn,
		commonPopup,
		price,
		radioGroups,
		uniNumberBox
	},
	//监听页面返回
	onBackPress(){
		for(let key in this.popup){
			//模态框打开状态
			if(this.popup[key] !== 'none'){
				this.popup[key]='none'
				//阻止页面返回s
				return true
			}
		}
	},
	onLoad(e) {
		let id = JSON.parse(e.detail).id
		this._api.get(`goods/${id}`).then(res=>{
			uni.setNavigationBarTitle({
				title:res.title
			})
			//商品详情
			this.detail = res
			this.detail.num=1
			// 轮播图
				this.banners = res.goodsBanner.map(v=>{
					v.src=v.url
					return v
				})
			//基础属性
			this.baseAttr=res.goodsAttrs.map(v=>{
				return {
					icon: 'icon-cpu',
					 title: v.name,
					  desc: v.value
				}
			})
			//热门评论
			let comments=res.hotComments.map(v=>{
				return{
					id:v.id,
					user_id:v.user.id,
					userpic: v.user.avatar,
					username: v.user.nickname,
					desc: v.review.data,
					create_time: v.review_time,
					goods_num: v.rating,
					imgList: v.review.image.map(j=>{
						return {src:j}
					})
				}
			})
			//模拟数据因为接口只有一条
			for (let i = 0 ; i < 4;i++) {
				this.comments.push(...comments)
			}
			//热门商品
			 this.common_list = res.hotList.map(v=>{
				v.oprice = v.min_oprice
				v.pprice = v.min_price
				return v
			})
			
			//商品其他详情
			this.context = res.content
			//多规格
			if(this.detail.sku_type===1){
				//商品规格
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
				this.selects=res.goodsSkusCard.map(v=>{
					 let list=v.goodsSkusCardValue.map(j=>{
						 return {
							 id :j.id,
							 name : j.value
						 }
					})
					return {
						id:v.id,
						title:v.name,
						selected:0,
						list
					}
				})
				//生成 skuText 字段
				this.detail.goodsSkus.forEach((item,index)=>{
					//生成模拟 sku 对应的商品图片
					item.image = this.img[index]
					let arr = []
					for(let key in item.skus){
						arr.push(item.skus[key].value)
					}
					item.skuText = arr.join(',')
				})
			}
			this.beforeReady=false
		})
	},
	filters:{
		formatStr(val){
			return val.replace(',',' ')
		}
	},
	computed:{
		...mapState('pathModule',{
			list:state=>state.list
		}),
		showSkuImag(){
			let index = this.checkedSkusIndex
			if(index !== -1){
				return this.detail.goodsSkus[index].image
			}
		},
		showPrice(){
			let index = this.checkedSkusIndex
			//没选 sku 规格就显示基础价格
			if(index === -1){
				return this.detail.min_oprice || 0.00
			}
			//选中了 就根据匹配的 sku 的 index 获取对应 sku 的价格
			return this.detail.goodsSkus[index].pprice
		},
		//获取选中的 sku 配置
		getSelectSku(){
			 let checkSku = this.selects.map(v=>{
				   return v.list[v.selected].name
				})
			//转换为 字符串并返回
			return checkSku.join(',')
		},
		//根据选中sku 和 detail 中的 skuText 匹配，并获取对应 sku 中的价格
		checkedSkusIndex(){
			//防止 this.detail.goodsSkus 还没生成时，计算属性更新 this.detail.goodsSkus 为 undefinde 的情况
			if (!Array.isArray(this.detail.goodsSkus)) {
				return -1
			}
			let index =  this.detail.goodsSkus.findIndex(v=>{
				return v.skuText === this.getSelectSku
			})
			return index
		},
		//获取最大库存
		maxStock(){
			//单规格
			if(this.detail.sku_type===0){
				return this.detail.stock
			}
			//多规格
			let index = this.checkedSkusIndex
			if(index !== -1){
				this.detail.num =  this.detail.goodsSkus[index].stock > 0 ? this.detail.num : 0
				return this.detail.goodsSkus[index].stock
			}
		},
		//分割收货地址
		getPath(){
			if(this.path.province){
				return this.path.province +' '+ this.path.city +' '+ this.path.district
			}
		},
	},
	methods: {
		...mapMutations('cartModule',['addGoodsToCart']),
		...mapActions('pathModule',['getPathData']),
		navToCoupon(){
			this.navigateTo({
				url:"/pages/coupon/coupon"
			})
		},
		//选择新地址页面
		addPath(){
			this.navigateTo({
				url:"/pages/user-path-edit/user-path-edit"
			})
			this.hide('express')
		},
		//添加购物车
		addCartFn(){
			//有库存是才执行
			if(this.maxStock > 0){
				//整合数据
				this.detail['attrs']=this.selects
				this.detail['checked']=false
				this._api.post('cart',{
					shop_id:this.detail.sku_type === 0 ? this.detail.id : this.detail.goodsSkus[this.checkedSkusIndex].id,
					skus_type:this.detail.sku_type,
					num:this.detail.num},
					{token:true,checkToken:true}
					).then(res=>{
						//通知购物车页面请求更新
						uni.$emit('updateCart')
						//添加到购物车
						this.addGoodsToCart(this.detail)
						//关闭popup
						this.hide('attr')
						if(this.$store.state.userModule.token){
							//保存成功提示
							uni.showToast({
								title: '加入成功'
							});
						}
					})
			}
		},
		show(key){
			//收货地址功能处理
			if(key==='express'&&this.$store.state.userModule.token){
				//请求收货地址数据
				 this.getPathData({page:1,refresh:false}).then(res=>{
					//获取默认地址
					this.defaultPath = this.getDefaultPath
				})
			}
			if(key==='express'&&!this.$store.state.userModule.token){
				 return this.navigateTo()
			}
			this.popup[key]="show"
		},
		hide(key){
			this.popup[key]="hide"
			let timer = setTimeout(()=>{
				this.popup[key]="none"
				clearTimeout(timer)
				timer=null
			},200)
		},
		preview(src, e) {
			// do something
			console.log('src: ' + src);
		},
		navigate(href, e) {
			// 如允许点击超链接跳转页面，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
			console.log('href: ' + href);
			uni.showModal({
				content: '点击链接为：' + href,
				showCancel: false
			});
		},
		//选择收货地址
		selectPath(item){
			this.path = {
				province: item.province,
				city: item.city,
				district: item.district
			}
			this.hide('express')
		}
	}
};
</script>

<style scoped>
	.uparse{
		padding: 0 !important;
		margin-left: -5rpx;
		line-height: 0 !important;
	}
	
	
	/* ::v-deep .uni-list-item__content{
		flex-wrap: wrap !important;
	} */
</style>
