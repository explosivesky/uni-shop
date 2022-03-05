<template>
	<view style="height: 100%;" class="d-flex flex-column">
		<!-- #ifdef MP -->
		<!-- 自定义导航栏 -->
		<view class="d-flex a-center">
			<!-- 左边 -->
			<view class="d-flex a-center j-center text-muted flex-shrink" style="width: 85rpx;"><text class="iconfont icon-xiaoxi"></text></view>
			<!-- 中间 -->
				<view class="d-flex a-center bg-light text-light-muted flex-1 rounded" style="height: 65rpx;" @click="navigateTo">
					<text class="iconfont icon-sousuo mx-2"></text>
					智能积木
				</view>
			<!-- 右边 -->
			<view class="d-flex a-center j-center text-muted flex-shrink" style="width: 85rpx;"><text class="iconfont icon-richscan_icon"></text></view>
		</view>
		<!-- #endif -->
		<!-- 顶部选项卡 -->
		<scroll-view :scroll-with-animation="true" scroll-x class="scroll-row" :scroll-into-view="scrollinto">
			<view
				class="scroll-row-item px-3 font-md"
				style="height: 80rpx; line-height: 80rpx;"
				v-for="(item, index) in tabBars"
				:key="index"
				@click="tabEvent(index)"
				:id="'tab' + index"
			>
				<text class="py-2" :class="tabIndex === index ? 'main-top-bar' : ''">{{ item.name }}</text>
			</view>
		</scroll-view>
		<swiper :duration="150" :current="tabIndex" :style="'height:' + scrollH + 'px'" @change="onChengeTab">
			<swiper-item v-for="(item, index) in newsitems" :key="index">
				<scroll-view scroll-y :style="'height:' + scrollH + 'px'" @scrolltolower="loadMore(index)">
					<template v-if="item.list.length > 0">
					<block v-for="(list, listIndex) in item.list" :key="listIndex">
						<!-- 轮播图 -->
						<swiper-image v-if="list.type === 'swiper'" :resdata="list.data" />
						<!-- 图标 -->
						<template v-if="list.type === 'indexnavs'">
							<index-nav :resdata="list.data" />
							<divider />
						</template>
					
						<template v-if="list.type === 'threeAdv'">
							<!-- 三图广告 -->
							<three-advs :resdata="list.data" />
							<divider />
						</template>
						<!-- card -->
						<!-- <card :showhead="true" headTitle="每日精选">
								<block><image src="../../static/images/bg.jpg" mode="widthFix"></image></block>
							</card> -->
						<!-- h3  w370 h370 m5 -->
						<!-- 公共列表 -->
						<view class="row j-sb" v-if="list.type === 'list'">
							<block v-for="(item2, index2) in list.data" :key="index2">
								<common-list :item="item2" :index="index2"></common-list>
							</block>
						</view>
					</block>
					</template>
					<template v-else-if="item.firstLoading==='before'||item.firstLoading==='ing'">
						<view class="d-flex j-center a-center pt-5">
							<text class="font-md text-light-muted">加载中...</text>
						</view>
					</template>
					<template v-else>
					<view class="d-flex j-center a-center pt-5">
						<text class="font-md text-light-muted">暂无数据</text>
					</view>
					</template>
					
					<!-- 上拉加载更多 -->
					<view class="d-flex text-light-muted font-md a-center j-center py-2" v-if="item.firstLoading==='after'&&item.list.length !== 0">{{ item.upLoadText }}</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import swiperImage from '@/components/index/swiper-image.vue';
import indexNav from '@/components/index/index-nav.vue';
import threeAdvs from '@/components/index/three-advs.vue';
import card from '@/components/common/card.vue';
import commonList from '@/components/common/common-list.vue';
export default {
	data() {
		return {
			scrollinto: '',
			scrollH: 0,
			windowHeight:0,
			tabIndex: 0,
			tabBars: [],
			newsitems: []
		};
	},
	components: {
		swiperImage,
		indexNav,
		threeAdvs,
		card,
		commonList
	},
	onLoad() {
		this.__init();
		//给 scroll-row 动态添加可视区域
		uni.getSystemInfo({
			success: res => {
				// #ifdef MP
				let navbarH = 0;
				// #endif
				// #ifndef MP
				//rpx 转 px
				let navbarH = uni.upx2px(90);
				// #endif
				//获取系统可使用窗口高度 -
				this.scrollH = res.windowHeight - uni.upx2px(80) - navbarH;
				this.windowHeight = res.windowHeight - uni.upx2px(90)
				console.log(this.windowHeight)
			}
		});
	},
	// 按钮点击时触发
	onNavigationBarButtonTap(e) {
		if(e.index===0){
			uni.navigateTo({
				url:'/pages/msg-list/msg-list'
			})
		}
	},
	methods: {
		__init() {
			this._api.get('index_category/data').then(res=>{
				this.tabBars = res.category;
				let data = res.data
				let arr = [];
				for (var i = 0; i < this.tabBars.length; i++) {
					let obj = {
						list: [],
						//1.上拉加载更多 2.加载中 3.没有更多了
						upLoadText: '上拉加载更多',
						//before 加载前 after 加载后
						firstLoading: 'before',
						
					};
					if (i == 0){
						obj.list = data;
						obj.firstLoading='after'
					}
					arr.push(obj);
				}
				this.newsitems = arr;
			})
			
		},
		//tab 点击钩子
		tabEvent(index) {
			if (this.tabIndex === index) return;
			this.tabIndex = index;
			this.scrollinto = 'tab' + index;
		},
		//swiper 滑动钩子
		onChengeTab(e) {
			//获取当前索引
			let index = e.detail.current
			//让 swiper 组件关联 tab 组件滑动效果
			this.tabEvent(index);
			this.addData(index);
		},
		//追加数据
		addData(index,isUpload=false) {
			let id = this.tabBars[index].id
			let page = Math.ceil((this.newsitems[index].list.length/5)+1)
			if(this.newsitems[index].firstLoading==='before' ||  isUpload){
				this.newsitems[index].firstLoading='ing'
				this._api.get(`index_category/${id}/data/${page}`).then(res => {
					res.forEach(v=>{
						if(!Array.isArray(v.data)){
							v.data=Object.values(v.data)
						}
					})
					this.newsitems[index].list = res.length === 0 ?[...this.newsitems[index].list,...res] : [...res];
					this.newsitems[index].upLoadText = res.length < 5 ? '没有更多了' : '下拉加载更多'
					this.newsitems[index].firstLoading='after'
					if(isUpload && res.length > 5)uni.showToast({title:'加载成功',icon:'none'})
				})
			}
			
		},
		//上拉加载钩子
		loadMore(index) {
			let item = this.newsitems[index];
			if (item.upLoadText !== '上拉加载更多') return;
			item.upLoadText = '加载中...';
			this.addData(index,true)
		},
		navigateTo(){
			uni.navigateTo({
				url:'/pages/search/search'
			})
		}
	}
};
</script>

<style scoped>
	.place{
		/* #ifdef MP */
		position: fixed;
		top: 90rpx;
		left: 0;
		right: 0;
		/* #endif */
	}
</style>
