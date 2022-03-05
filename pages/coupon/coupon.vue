<template>
	<view class="p-3">
			<block v-for="(item,index) in list" :key="index">
				<coupon :item="item" :index="index" @click.native="getCoupon(item)">
					<text v-if="!item.status">已失效</text>
					<text v-else-if="item.disabled">已领取</text>
					<text v-else>马上领取</text>
				</coupon>
			</block>
			<no-thing v-if="list.length === 0" noThingImgSrc="/static/images/nothing/no_pay.png" noThingText="您还没有优惠券"/>
	</view>
</template>

<script>
	import coupon from '@/components/order-coupon/coupon.vue'
	import noThing from '@/components/common/no-thing.vue'
	export default {
		data() {
			return {
				list: [],
				page:1,
				uploadText:'下拉加载更多'
			}
		},
		components:{
			coupon,
			noThing
		},
		onLoad() {
			this.__init()
		},
		onPullDownRefresh() {
			this.page=1
			this.__init().then(res=>{
				uni.stopPullDownRefresh()
				uni.showToast({
					title: '刷新成功',
					icon:'none'
				});
			},rej=>{
				uni.stopPullDownRefresh()
			})
		},
		onReachBottom() {
			if(uploadText!=='下拉加载更多')return
			this.uploadText='加载中...'
			this.page++
			this.__init(true)
		},
		methods: {
			__init(uploading=false){
				return new Promise((resolve,reject)=>{
					this._api.get(`coupon/${this.page}`,{token:true}).then(res=>{
						let list = res.map(v=>{
							let time = new Date().getTime()
							let status = (v.end_time > time/1000)&&v.status === 0
							return {
								id:v.id,
								title:v.name,
								start_time:v.start_time,
								end_time:v.end_time,
								price:v.value,
								desc:v.desc,
								status,//false已失效
								disabled:(v.coupon_user.used > 0),//true 已领取
								type:v.type
							}
						})
						this.list = uploading ? [...this.list,...list] : [...list]
						this.uploadText = res.length===10 ? '下拉加载更多' : '没有更多了'
						resolve()
					}).catch(err=>{
						this.page--
						reject()
					})
				})
				
			},
			//领取优惠券
			getCoupon(item){
				this._api.post(`getcoupon/${item.id}`,{},{token:true}).then(res=>{
					item.disabled = false
					uni.showToast({
						title: '领取成功'
					});
				})
			}
		}
	}
</script>

<style>
page{
	background-color: #F5F5F5;
}
</style>
