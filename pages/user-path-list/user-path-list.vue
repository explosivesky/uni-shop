<template>
	<view>
		<uni-swipe-action>
			<uni-swipe-action-item :right-options="options2" :show="isOpened" :auto-close="false" @click="bindClick($event,index)"  v-for="(item,index) in list" :key="index">
				<uni-list-item rightIcon="icon-you" rightIconColor="#b5b5b5" @click="choose(item)">
					<view class=" text-light-muted d-flex flex-column j-sb a-start font" style="height: 200rpx;">
						<view class="d-flex a-center">
							<text class="main-text-color line-h-sm mr-1">{{item.name}}</text>
							<text class="font-sm text-light-muted mr-1">{{item.phone}}</text>
							<text class="main-text-color" v-if="index===0 && item.last_used_time != null">[默认]</text>
						</view>
						<view class="">{{item.province}} {{item.city}} {{item.district}}</view>
						<view class="">{{item.address}}</view>
					</view>
				</uni-list-item>
			</uni-swipe-action-item>
		</uni-swipe-action>
		<!-- 上拉加载更多 -->
		<view class="d-flex text-light-muted font-md a-center j-center py-2" v-if="list.length !== 0">{{ upLoadText }}</view>
		<no-thing noThingImgSrc="/static/images/nothing/no_receiving.png" noThingText='还没有收货地址' v-if="pathIsNull"/>
	</view>
</template>

<script>
import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue';
import noThing from '@/components/common/no-thing.vue';

import {mapState,mapMutations,mapActions} from 'vuex'
export default {
	data() {
		return {
			isEdit:false,
			options2: [
				{
					text: '修改',
					style: {
						backgroundColor: '#007aff'
					}
				},
				{
					text: '删除',
					style: {
						backgroundColor: '#F56C6C'
					}
				}
			],
			isOpened: 'none',
			page:1,
			upLoadText:'上拉加载更多',//1.上拉加载更多 2.加载中 3.没有更多了
			pathIsNull:false
		};
	},
	onNavigationBarButtonTap() {
		uni.navigateTo({
			url: '/pages/user-path-edit/user-path-edit'
		});
	},
	onLoad(e) {
		//是否选择收货地址
		if(e.type==='choose'){
			this.isEdit=true
		}
		this.__init(true)
		//通知收货地址页面刷新页面
		uni.$on('refresh',()=>{
			this.__init(true)
		})
	},
	onUnload() {
		uni.$off('refresh',()=>{})
	},
	//到页面底部时的钩子
	onReachBottom() {
		if(this.upLoadText!=='上拉加载更多')return 
		this.upLoadText='加载中...'
		this.page++
		this.__init(false)
	},
	//下拉刷新钩子
	onPullDownRefresh() {
		this.__init(true,()=>{
			uni.stopPullDownRefresh()
			uni.showToast({
				title: '刷新成功',
				icon:'none'
			});
		})
	},
	components: {
		uniListItem,
		noThing
	},
	computed:{
		...mapState('pathModule',{
			list:state=>state.list
		})
	},
	onBackPress() {
		// uni.navigateBack()
	},
	methods: {
		...mapMutations('pathModule',['deletePath','fullPath']),
		...mapActions('pathModule',['getPathData']),
		__init(refresh=false,callback=false){
			//refresh 刷新 : 上拉加载
			this.page = refresh ? 1 : this.page
			this.getPathData({page:this.page,refresh}).then(res=>{
				//没有收货地址
				if(res.length===0 && page===1)return this.pathIsNull=true
				//没有更多收货地址了
				 this.upLoadText= res.length < 10 && this.page!==1 ? '没有更多收货地址了' : '上拉加载更多'
				this.fullPath({list:res,refresh})
				if(typeof callback === 'function')callback()
			})
			return
			this._api.get(`useraddresses/${this.page}`,{},{token:true}).then(res=>{
				
			})
		},
		bindClick(e,index) {
			switch (e.index) {
				case 0: //修改
				let list = {
					index,
					list:this.list,
				}
					uni.navigateTo({
						url:"/pages/user-path-edit/user-path-edit?data="+JSON.stringify(list)
					})
					break;
				case 1: //删除
					uni.showModal({
						content: '确认要删除此地址吗?',
						success:(res) =>{
							if (res.confirm) {
								this._api.delete(`useraddresses/${this.list[index].id}`).then(res=>{
									this.deletePath(index)
									uni.showToast({
										title:'删除成功'
									})
								})
							}
						}
					});
					break;
			}
		},
		//点击地址列表返回到订单结算页面
		choose(item){
			//只有isEdit为 true 的情况下才修改订单结算地址
			if(this.isEdit){
				this.isEdit=false
				//通知订单结算页面修改地址
				uni.$emit('editPath',item)
				//关闭当前页面
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
};
</script>

<style scoped></style>
