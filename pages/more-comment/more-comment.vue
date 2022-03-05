<template>
	<view class="border-top">
		<view class="d-flex font-md border-bottom ml-4 pr-2 py-2">
			<text>用户评价 ({{ total }})</text>
			<view class="ml-auto">
				<text class="main-text-color mr-1">{{ good_rate * 100 }}%</text>
				<text>满意</text>
			</view>
		</view>
		<view class="row py-2 px-4">
			<text
				class="my-1 mr-2 comment border rounded px-4 py-2 cate-item"
				:class="{ 'cate-item-active': index === activeIndex }"
				v-for="(item, index) in cate_list"
				:key="index"
				@click="tagActive(index)"
			>
				{{ item.name }}
			</text>
		</view>
		<divider />

		<view class="px-4">
			<view class="d-flex py-2" v-for="(v, i) in commentList" :key="i">
				<view class="a-stretch pr-4 "><image :src="v.user.avatar" class="rounded" style="width: 100rpx; height: 100rpx;"></image></view>
				<view class="flex-1 d-flex flex-column j-start">
					<view class="d-flex a-center">
						<text class="font-weight font-md" style="color:#4c6687;">{{ v.user.nickname }}</text>
						<view class="ml-auto main-text-color">
							<text class="iconfont icon-xihuan mr-2"></text>
							<text>{{ v.rating | ratingFormant }}</text>
						</view>
					</view>
					<text class="my-3">{{ v.review.data }}</text>
					<view class="row" style="margin: 0 -5rpx;" v-if="v.review.image.length > 0">
						<view class="span24-8" style="padding: 5rpx; margin-bottom: -15rpx;" v-for="(img, index) in v.review.image">
							<image :src="img" mode="widthFix" style="height: 100rpx;"></image>
						</view>
					</view>
					<view class="d-flex a-center j-sb font text-light-muted mt-2 mb-3">
						<text>{{ v.review_time }}</text>
						<view class="d-flex a-center">
							<text class="line-h0 mr-2">{{ v.goods_num }}</text>
							<text class="iconfont icon-dianzan mr-4 line-h0"></text>
							<text class="line-h0 mr-2">0</text>
							<text class="iconfont icon-pinglun1 line-h0"></text>
						</view>
					</view>
					<!-- 客服回复 -->
					<view class="d-flex bg-light-secondary rounded" v-if="v.extra">
						<view class="flex-1 font p-1-5" v-for="(extra, extra_i) in v.extra" :key="extra_i">
							<template v-if="!extra.isuser">
								<text class="main-text-color mr-2">官方回复 :</text>
								<text class="mr-3">{{ extra.data }}</text>
								<view class="d-flex a-center text-light-muted d-inline-block">
									<text class="iconfont icon-dianzan mr-1"></text>
									<text>赞客服 {{ extra.good_num }}</text>
								</view>
							</template>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 上拉加载更多 -->
		<view class="d-flex text-light-muted font-md a-center j-center py-2" v-if="commentList.length > 0">{{ upLoadText }}</view>
	</view>
</template>

<script>
import divider from '@/components/common/divider.vue';
export default {
	data() {
		return {
			activeIndex: 0,
			id: 0,
			commentList: [],
			total: 0,
			good_rate: 0,
			page: 0,
			//1.上拉加载更多 2.加载中 3.没有更多了
			upLoadText: '上拉加载更多',
			cate_list: [{ name: '全部', value: '' }, { name: '好评', value: '/good' }, { name: '中评', value: '/middle' }, { name: '差评', value: '/bad' }]
		};
	},
	onLoad(e) {
		this.id = e.id;
		this.getData();
	},
	//页面上拉触底事件
	onReachBottom() {
		if (this.upLoadText !== '上拉加载更多') return;
		this.page++;
		this.upLoadText = '加载中...';
		this.getData();
	},
	//监听下拉刷新
	onPullDownRefresh() {
		this.getData(() => {
			//停止下拉刷新
			uni.stopPullDownRefresh();
			uni.showToast({
				title: '刷新成功',
				icon: 'none'
			});
		}, true);
	},
	filters: {
		ratingFormant(val) {
			if (val === 3) {
				return '中评';
			} else if (val > 3) {
				return '好评';
			} else {
				return '差评';
			}
		}
	},
	components: {
		divider
	},
	methods: {
		getData(callback = false, refresh = false) {
			let rate = this.cate_list[this.activeIndex].value;
			this._api.get(`goods/${this.id}/comments${rate}?page=${this.page}`).then(res => {
				if (res.list.length) {
					this.total = res.total;
					this.good_rate = res.good_rate;
					for (let i = 0; i < 10; i++) {
						this.commentList.push(res.list[0]);
					}
					this.commentList = refresh ? [...res.list] : [...res.list, ...this.commentList];
				}
				this.upLoadText = res.list.length ? '上拉加载更多' : '没有更多了';
				callback();
			});
		},
		tagActive(index) {
			uni.showLoading({ title: '加载中...' });
			this.activeIndex = index;
			this.getData(() => {
				uni.hideLoading();
				uni.showToast({ title: '加载成功', icon: 'none' });
			}, false);
		}
	}
};
</script>

<style scoped>
.cate-item {
	background-color: #fff2ec;
	color: #7d706a;
	border-color: #f8e7e2;
}
.cate-item.cate-item-active {
	background-color: #ff7a00 !important;
	color: #fefae1 !important;
	border-color: #ffdaa9 !important;
}
</style>
