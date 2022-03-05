<template>
	<view class="page" style="height: 100%;">
		<view class="bg-white">
			<view class="px-2 d-flex py-3 a-center border-bottom">
				<text class="flex-shrink mr-3">收货人:</text>
				<input type="text" v-model="form.name" class="flex-1"/>
			</view>
		</view>
		<view class="bg-white">
			<view class="px-2 d-flex py-3 a-center">
				<text class="flex-shrink mr-3">手机号码:</text>
				<input type="text" v-model="form.phone" class="flex-1"/>
			</view>
		</view>
		<view class="bg-white">
			<view class="px-2 d-flex py-3 a-center">
				<text class="flex-shrink mr-3">邮箱:</text>
				<input type="text" v-model="form.zip" class="flex-1"/>
			</view>
		</view>
		<divider/>
		<view class="bg-white">
			<view class="px-2 d-flex py-3 a-center border-bottom">
				<text class="flex-shrink mr-3">所在地址:</text>
				<input type="text" :value="path" class="flex-1" disabled @click="showMulLinkageThreePicker" placeholder="请选择所在地区"/>
				<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="pickerValue"
				@onConfirm="onConfirm"></mpvue-city-picker>
			</view>
		</view>
		<view class="bg-white">
			<view class="px-2 d-flex py-3 a-center">
				<text class="flex-shrink mr-3">详细地址:</text>
				<input type="text" v-model="form.address" class="flex-1"/>
			</view>
		</view>
		<divider/>
		<view class="bg-white d-flex px-2 py-3 a-center">
			<text class="flex-shrink mr-3">设为默认地址:</text>
			<view class="flex-1 d-flex j-end a-center">
				<switch :checked="form.default === 0 ? false : true" color="#ff7200" @change="form.default = $event.target.value ? 1 : 0"></switch>
			</view>
		</view>
		<view class="mt-3 border mx-3 rounded d-flex j-center a-center main-bg-color text-white store" @click="submit" hover-class="main-bg-hover-color">
			保存
		</view>
	</view>
</template>

<script>
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue'
	import divider from '@/components/common/divider.vue'
	import mpvueCityPicker from '@/components/uni-ui/mpvue-citypicker/mpvueCityPicker.vue'
	
	import {mapState,mapMutations,mapActions} from 'vuex'
	export default {
		data() {
			return {
				themeColor: '#007AFF',
				pickerValue: [0, 0, 1],
				isEdit:true, //true增加 /false 修改
				index:-1,//修改时需要的 index
				form:{
					name:'',
					phone:'',
					province:'',
					city:'',
					district:'',
					zip:'',
					address:'',
					default:0
				}
			}
		},
		components:{
			uniListItem,
			divider,
			mpvueCityPicker
		},
		onBackPress() {
			//页面返回的时候关闭 picker
		  if (this.$refs.mpvueCityPicker.showPicker) {
		  	this.$refs.mpvueCityPicker.pickerCancel();
		    return true;
		  }
		},
		onLoad(e) {
			if(e.data){
				let result = JSON.parse(e.data)
				this.form = result.list[result.index]
				this.index = result.index
				this.form.default = this.getDefault
				this.isEdit=false
				//修改 导航按标题
				uni.setNavigationBarTitle({
					title:"修改收货地址"
				})
			}
		},
		onUnload() {
			//页面销毁的时候 关闭
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel()
			}
		},
		computed:{
			//分割收货地址
			path(){
				if(this.form.province){
					return this.form.province +'-'+ this.form.city +'-'+ this.form.district
				}
			},
			//获取 default 值用于控制 switch
			getDefault(){
				return this.form.last_used_time == null ? 0 : 1
			}
		},
		methods: {
			...mapMutations('pathModule',['addPath','editPath']),
			...mapActions('pathModule',['editPathAction','addPathAction']),
			
			
			submit(){
				//增加
				let msg = this.isEdit ? '添加' : '修改'
				if(this.isEdit){
					this._api.post('useraddresses',{...this.form},{token:true}).then(res=>{
						this.addPathAction(this.form)
						//通知收货地址页面刷新页面
						uni.$emit('refresh')
						uni.navigateBack({ delta: 1 });
						uni.showToast({
							title:`${msg}成功`
						})
					})
				}else{
					//修改
					this._api.post(`useraddresses/${this.form.id}`,{...this.form},{token:true}).then(res=>{
						this.editPathAction({item:this.form,index:this.index})
						this.isEdit=true
						//通知收货地址页面刷新页面
						uni.$emit('refresh')
						uni.navigateBack({ delta: 1 });
						uni.showToast({
							title:`${msg}成功`
						})
						
					})
					
					
				}
			},
			//三级联动确定
			onConfirm(e) {
				let arr = e.label.split('-')
				this.form.province = arr[0]
				this.form.city = arr[1]
				this.form.district = arr[2]
				this.pickerValue = e.value
			},
			// 显示三级联动选择
			showMulLinkageThreePicker() {
				this.$refs.mpvueCityPicker.show()
			},
			//switch
			switchChange($evnet){
				// console.log($evnet)
				// this.''
			}
		}
	}
</script>

<style scoped>
	.store{
		height: 90rpx; background-color: #FFFFFF;
	}
</style>
