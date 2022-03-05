<template>
	<view>
		<!-- 排序 -->
		<view class="d-flex position-fixed left-0 right-0 top-0 border-top border-bottom bg-white main-border-color j-center a-center" style="z-index: 1000; height: 100rpx;">
			<view class="flex-1 d-flex j-center a-center" v-for="(item,index) in screen.list" @click="changScrenn(index)">
				<text class="font" :class="screen.currentIndex === index ? 'main-text-color':'text-muted'">{{item.name}}</text>
				<view class="">
					<view class="iconfont icon-paixu-shengxu line-h0" :class="item.status === 1 ? 'main-text-color':'text-light-muted'"></view>
					<view class="iconfont icon-paixu-jiangxu line-h0" :class="item.status === 2 ? 'main-text-color':'text-light-muted'"></view>
				</view>
			</view>
			<view class="flex-1 d-flex j-center a-center main-text-color">
				<text class="font main-text-color" @click="openDrawer">筛选</text>
			</view>
		</view>
		
		<view style="height: 100rpx;"></view>
		<!-- 商品列表 -->
		<search-list :list="list" v-if="showGoods"/>
		<view class="d-flex j-center a-center pt-5" v-else>
			<text v-html="getHTML"></text>
		</view>
		<!-- 上拉加载更多 -->
		<view class="d-flex text-light-muted font-md a-center j-center py-2" v-if="uploadFlag && showGoods">{{ upLoadText }}</view>
		<view style="height: 100rpx;"></view>
		<!-- 抽屉 -->
		<uni-drawer :visible="showRight" mode="right" @close="closeDrawer">
			<card headTitle="价格范围" :showCover="false" :titleWeight="false" :showBorderBottom="false"></card>
			<radio-groups :label="label" :selected.sync="label.selected"/>
			<view class="position-fixed d-flex left-0 right-0 bottom-0 font-md">
				<view class="border-top flex-1 py-2 text-center main-bg-color text-white" hover-class="main-bg-hover-color" @click="reset">重置</view>
				<view class="border-top  flex-1 py-2 text-center" hover-class="bg-light-secondary" @click="confirm">确定</view>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
	import card from '@/components/common/card.vue'
	import uniDrawer from "@/components/uni-ui/uni-drawer/uni-drawer.vue"
	import radioGroups from "@/components/common/radio-groups.vue"
	import searchList from "@/components/search-list/search-list"
	export default {
		data() {
			return {
				screen:{
					currentIndex:0,
					list:[
						{name:'综合',status:1,key:'all'},
						{name:'销量',status:0,key:'sale_count'},
						{name:'价格',status:0,key:'min_price'}
					]
				},
				showRight: false,
				label:{
					selected:0,
					list:[
						{name:'不限',rule:false,value:false},
						{name:'0.01~0.03之间',rule:'between',value:'0.01,0.03'},
						{name:'0.03~0.04之间',rule:'between',value:'0.03,0.04'},
						{name:'4以上',rule:'>',value:'4'},
					]
				},
				list:[],
				title:'',
				page:1,
				showGoods:false,
				price:{},
				uploadFlag:false,
				upLoadText:'上拉加载更多',//1.上拉加载更多 2.加载中... 3.没有更多了
				keyword:''
			}
		},
		onLoad(e) {
			this.title=e.keyword
			this.__init()
		},
		//软键盘确定时触发
		onNavigationBarSearchInputConfirmed() {
			this.search(true)
		},
		//导航栏输入框改变时触发
		onNavigationBarSearchInputChanged(e) {
			this.keyword = e.text;
		},
		onNavigationBarButtonTap(e) {
			if(e.index==0)this.search(true)
		},
		//上拉刷新钩子
		onReachBottom(){
			if(this.upLoadText!=='上拉加载更多')return
			this.upLoadText='加载中...'
			this.page++
			this.__init(true,()=>{
				uni.showToast({
					title: '加载成功',
					icon:'none'
				});
			})
		},
		//下拉刷新钩子
		onPullDownRefresh() {
			this.__init(false,()=>{
				uni.stopPullDownRefresh()
				uni.showToast({
					title: '刷新成功',
					icon:'none'
				});
			})
		},
		computed:{
			goodsSort(){
				let obj = this.screen.list[this.screen.currentIndex] 
				let value = obj.status === 1 ? 'desc' : 'asc'
				return {
					[obj.key]:value
				}
			},
			getHTML(){
				return `<text class="text-light-muted font-md">没有 <text class="main-text-color">${this.title}</text>的相关商品</text>`
			},
			
		},
		components:{
			uniDrawer,
			card,
			radioGroups,
			searchList
		},
		methods: {
			__init(upload=false,callback=false){
				let page = upload ? this.page : 1
				this._api.post('goods/search',{title:this.title,page,...this.goodsSort,...this.price}).then(res=>{
					if(res.length===0){
						this.upLoadText = '没有更多了'
						this.uploadFlag=true
						return this.showGoods= upload ? true : false
					}
					this.showGoods=true
					let list = res.map(v=>{
					return{
						id:v.id,
						title:v.title,
						titlepic:v.cover,
						desc:v.desc,
						pprice:v.min_price,
						comment_num:v.comments_count,
						rate:v.comments_good_count
					}
				})
					this.list = upload ? [...this.list,...list] : [...list]
					if(typeof callback === 'function')callback()
				})
			},
			//tab栏切换时触发
			changScrenn(index){
				//判断当前点击是否是激活状态
				//如果是激活状态就光更改 上下图标的颜色
				let oldIndex = this.screen.currentIndex
				let oldItem = this.screen.list[oldIndex]
				if(index === oldIndex){
					 oldItem.status = oldItem.status===1?2:1
					this.__init()
					return
				}
				//移除旧激活状态
				oldItem.status=0
				this.screen.currentIndex = index
				//增加新激活状态
				let newItem = this.screen.list[index]
				newItem.status=1
				this.__init()
			},
			//打开抽屉
			openDrawer(){
				this.showRight=true
				//只要不点击确定 this.label.selected 永远为 0 
				this.oldSelect = this.label.selected
			},
			//抽屉确认按钮
			confirm(){
				this.showRight=false
				let obj = this.label.list[this.label.selected]
				//如果为 {name:'不限',rule:false,value:false} 请求时就不加 price 字段了
				if(!obj.rule&&!obj.value){
					this.price={}
					return this.__init()
				}
				//搜索当前选中的价格范围的商品
				this.price = {price:obj.rule+','+obj.value}
				this.__init()
			},
			//关闭抽屉钩子
			closeDrawer(){
				this.showRight=false
				this.label.selected = this.oldSelect
			},
			//重置
			reset(){
				this.resetSelect()
				this.confirm()
			},
			//重置筛选
			resetSelect(){
				this.label.selected=0
				this.price={}
			},
			//搜索时触发
			search(flag=false) {
				this.resetSelect()
				if (this.keyword === '') {
					return uni.showToast({
						title: '搜索词不能为空',
						icon: 'none'
					});
				}
				this.toSearchList(this.keyword)
			},
			//搜索相应商品并处理历史记录
			toSearchList(keyword){
				let searchList=uni.getStorageSync('keyword')
				searchList = searchList ? JSON.parse(searchList) : []
				this.title=keyword
				this.__init()
				//收起软键盘
				// #ifdef APP-PLUS
				plus.key.hideSoftKeybord();
				// #endif
				// #ifndef APP-PLUS
				uni.hideKeyboard();
				// #endif
				//不为空
				//判断是否为相同搜索词
				let index = searchList.indexOf(keyword);
				if (index !== -1) {
					searchList.unshift(searchList.splice(index, 1)[0]);
				} else {
					//添加评论
					searchList.unshift(keyword);
				}
				uni.setStorageSync('keyword', JSON.stringify(searchList));
			}
		}
	}
</script>

<style>

</style>
