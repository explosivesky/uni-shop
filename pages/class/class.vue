<template>
	<view class="d-flex border-top main-border-color animated fadeIn faster" style="height: 100%; box-sizing: border-box;">
		<!-- 左侧列表 -->
		<scroll-view scroll-y="true" class="border-right main-border-color" id="aside-scroll-view" style="flex: 1; height: 100%;" :scroll-top="leftScrollTop">
			<view class="border-bottom main-border-color py-2 d-flex j-center a-center left-scroll-item" v-for="(item, index) in cate" :key="index" @click="asideChange(index)">
				<text class="flex-1 text-center" :class="{ 'class-active': index === asideIndex }">{{ item.name }}</text>
			</view>
		</scroll-view>
		<!-- 右侧列表 -->
		<scroll-view scroll-y="true" style="flex: 3.5; height: 100%;" :scroll-top="rightScrollTop" @scroll="rightScrollEvent">
			<view class="row py-2 right-scroll-item" v-for="(item, index) in list" :key="index">
				<view class="span24-8 d-flex flex-column a-center j-center mb-5" @click="openDetail(item2.goods_id)" v-for="(item2, index2) in item.list" :key="index2">
					<image :src="item2.cover" style="height: 120rpx; width: 120rpx;" lazy-load></image>
					<view>{{ item2.name }}</view>
				</view>
			</view>
		</scroll-view>
		<my-loading :beforeReady="beforeReady" />
	</view>
</template>

<script>
import myLoading from '@/mixins/my-loading.js';
export default {
	mixins: [myLoading],
	data() {
		return {
			asideIndex: 0,
			cate: [],
			list: [],
			leftDomsTop: [], //左边每个模块的 top值
			rightDomsTop: [], //右边每个模块的 top值
			rightScrollTop: 0, //右边item要滚动的位置
			leftScrollTop: 0, //左边item要滚动的位置
			asideItemHeight: 0 //左边 item 元素的高度
		};
	},
	watch: {
		//监听 当前的左边 scroll-item 对超出屏幕距离进行处理
		async asideIndex(newval) {
			let data = await this.getElInfo({
				size: true,
				scrollOffset: true
			});
			//获取左边scroll-view的高度
			let H = data.height;
			//获取左边 scroll-view 的 top 滚动距离
			let ST = data.scrollTop;
			//item 在上边
			if (this.asideItemHeight < ST) {
				return (this.leftScrollTop = this.leftDomsTop[newval]);
			}
			//在下边
			//scroll-view的高度 + scroll-top的高度 < item的高度 + 当前选中的item的局部位置的高度
			if (H + ST < this.leftDomsTop[newval] + this.asideItemHeight) {
				this.leftScrollTop = this.leftDomsTop[newval] + this.asideItemHeight - H;
			}
		}
	},
	onLoad() {
		this.__init();
	},
	methods: {
		getElInfo(obj = {}) {
			return new Promise((resolve, reject) => {
				let options = {
					size: obj.size ? true : false,
					rect: obj.rect ? true : false,
					scrollOffset: obj.scrollOffset ? true : false
				};
				//获取选择器
				const query = uni.createSelectorQuery().in(this);
				let q = obj.all
					? query.selectAll(`.${obj.all}-scroll-item`)
					: //因为 id 只有一个，所以用 select
					  query.select('#aside-scroll-view');
				q.fields(options, data => {
					resolve(data);
				}).exec();
			});
		},
		__init() {
			/*
			  cate:[
				  {name:分类},
				  {name:分类},
				  ]
			  list:[
				  {
					  list:[{
						  src: '/static/images/demo/demo6.jpg',
						  name: `分类${i}-商品${j}`
					  }]
				  }
			  ] 
			*/
			this._api.get('category/app_category').then(res => {
				for (let i = 0; i < 4; i++) {
					res.forEach(v => {
						this.cate.push({ name: v.name });
						this.list.push({ list: v.app_category_items });
					});
				}
				this.$nextTick(() => {
					//获取左边每个节点的 top 值保存到数组中
					this.getElInfo({
						size: true,
						rect: true,
						all: 'left'
					}).then(data => {
						this.leftDomsTop = data.map(v => {
							this.asideItemHeight = v.height;
							return v.top;
						});
					});
					//获取右边每个节点的 top 值保存到数组中
					this.getElInfo({
						rect: true,
						all: 'right'
					}).then(data => {
						this.rightDomsTop = data.map(v => v.top);
					});
				});
				this.beforeReady = false;
			});
		},
		//侧边栏改变时
		asideChange(index) {
			this.asideIndex = index;
			//右边滚动到对应位置
			this.rightScrollTop = this.rightDomsTop[index];
		},
		//右边滚动事件
		rightScrollEvent(e) {
			this.rightDomsTop.forEach((v, k) => {
				//当滚动 top 值 高于 当前 dom 的top值时，赋值当前成立的 index
				// +1 是因为有个 border-top
				if (e.detail.scrollTop + 1 > v) this.asideIndex = k;
				return false;
			});
		},
		//跳转详情页面
		openDetail(id){
			let detail = JSON.stringify({id})
			uni.navigateTo({
				url:"/pages/detail/detail?detail="+detail
			})
		}
	}
};
</script>

<style>
.class-active {
	border-left: 8rpx solid #ff6a00 !important;
	color: #ff6a00;
}
image{will-change: transform}
</style>
