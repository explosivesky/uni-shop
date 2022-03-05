<template>
	<view>
		<!-- #ifdef MP -->
		<!-- 自定义导航栏 -->
		<view class="d-flex a-center position-fixed top-0 right-0 left-0 bg-white" style="height: 90rpx; z-index: 1000;">
			<!-- 左边 -->
			<view class="d-flex a-center j-center text-muted flex-shrink" style="width: 85rpx;"></view>
			<!-- 中间 -->
				<input class="d-flex a-center bg-light text-light-muted flex-1 rounded" placeholder="智能积木" style="height: 65rpx;" v-model="keyword"></input>
			<!-- 右边 -->
			<view class="d-flex a-center j-center text-muted flex-shrink" style="width: 85rpx;" @click="search">搜索</view>
		</view>
		<view style="height: 90rpx;"></view>
		<!-- #endif -->
		<scroll-view scroll-y :style="'height:' + scrollH + 'px'">
			<!-- 热门搜索 -->
			<card headTitle="热门搜索" bodyCover="/static/images/demo/demo8.jpg"></card>
			<view class="px-2"><color-tag :item="item" v-for="(item, index) in hot" :key="index" @click="toSearchList(item.name)"/></view>
			
			<!-- 常用分类 -->
			<card headTitle="常用分类" :showCover="false" :showBorderBottom="false"></card>
			<view class="px-2"><color-tag @click="toSearchList(item.name)" :item="item" :color="false" v-for="(item, index) in cate" :key="index" /></view>
			<card :showCover="false" :bodyPadding="false">
				<template #title>
						<view class="d-flex j-sb a-center" style="width: 100%;">
							<text class="font-weight font-md  mr-auto">搜索记录</text>
							<text class="font text-primary" @click="clearKeyWord">清除所有记录</text>
						</view>
				</template>
			</card>
			<block v-for="(item, index) in searchLsit" :key="index">
				<uni-list-item :title="item" :showArrow="false" v-if="index + 1 <= loadingNum" @click="toSearchList"></uni-list-item>
			</block>
			<uni-list-item :showArrow="false" v-if="searchLsit.length > loadingNum" @click="loadMore">
				<view class="d-flex j-center" style="width: 100%;">
					<text>{{ loadingText }}</text>
				</view>
			</uni-list-item>
		</scroll-view>
	</view>
</template>

<script>
import card from '@/components/common/card.vue';
import colorTag from '@/components/search/color-tag.vue';
import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue';
export default {
	data() {
		return {
			hot: [{ name: '领券中心' }, { name: 'Redmi K20' }, { name: 'RedmiBook 14' }, { name: '智能积木 越野四驱车' }, { name: '手环 腕带' }],
			cate: [{ name: '耳机' }, { name: '手机' }, { name: '音箱' }, { name: '手表' }, { name: '配件' }, { name: '网关/传感器' }, { name: '健康' }, { name: '酷玩' }],
			searchLsit: [],
			keyword: '',
			scrollH: 500,
			loadingText: '点击加载更多',
			loadingNum: 5,
			isShow: false
		};
	},
	onShow() {
		uni.getSystemInfo({
			success: e => {
				this.scrollH = e.windowHeight;
			}
		});
		let keyWord = uni.getStorageSync('keyword');
		this.searchLsit = keyWord ? JSON.parse(keyWord) : [];
	},
	//导航栏 搜索按钮
	onNavigationBarButtonTap(e) {
		if (e.index === 0) {
			this.search();
		}
	},
	//导航栏输入框改变时触发
	onNavigationBarSearchInputChanged(e) {
		this.keyword = e.text;
	},
	//导航栏输入框 软键盘完成时触发
	onNavigationBarSearchInputConfirmed() {
		this.search();
	},
	components: {
		card,
		colorTag,
		uniListItem
	},
	methods: {
		//清除历史记录
		clearKeyWord() {
			uni.showModal({
				title: '提示',
				content: '是否删除历史记录',
				cancelText: '取消',
				confirmText: '清除',
				success: res => {
					if (res.confirm) {
						uni.removeStorageSync('keyword')
						this.searchLsit = [];
						this.loadingNum = 5;
					}
				}
			});
		},
		//点击加载更多
		loadMore() {
			this.loadingText = '加载中...';
			this.loadingNum += 5;
			this.loadingText = '点击加载更多';
		},
		//搜索时触发
		search() {
			if (this.keyword === '') {
				return uni.showToast({
					title: '搜索词不能为空',
					icon: 'none'
				});
			}
			this.toSearchList(this.keyword)
		},
		//跳转搜索列表并处理历史记录
		toSearchList(keyword){
			uni.navigateTo({
				url: '/pages/search-list/search-list?keyword=' + keyword
			});
			//收起软键盘
			// #ifdef APP-PLUS
			plus.key.hideSoftKeybord();
			// #endif
			// #ifndef APP-PLUS
			uni.hideKeyboard();
			// #endif
			//不为空
			//判断是否为相同搜索词
			let index = this.searchLsit.indexOf(keyword);
			if (index !== -1) {
				this.searchLsit.unshift(this.searchLsit.splice(index, 1)[0]);
			} else {
				//添加评论
				this.searchLsit.unshift(keyword);
			}
			uni.setStorageSync('keyword', JSON.stringify(this.searchLsit));
		}
	}
};
</script>

<style></style>
