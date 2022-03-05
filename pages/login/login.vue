<template>
	<view>
		<uni-status-bar />
		<view class="d-flex j-sb px-3">
			<text class="font-md text-light-muted iconfont icon-shanchu1" @click="back"></text>
			<text class="text-muted">忘记密码</text>
		</view>
		<view style="height: 100rpx;"></view>
		<view class="text-light-muted" style="padding: 0 70rpx;">
			<text class="font-lg font-weight mb-5 text-dark">密码登录</text>
			<input
				type="text"
				v-model="username"
				@focus="focus('username')"
				@blur="blur('username')"
				:class="input.userNameFlag ? 'input-active' : ''"
				class="uni-input border-bottom mt-5 py-3 mb-4 p-0"
				placeholder="请输入手机号/邮箱/账号"
				placeholder-class="text-light-muted"
			/>
			<input
				type="text"
				v-model="password"
				@focus="focus('pwd')"
				@blur="blur('pwd')"
				:class="input.pwdFlag ? 'input-active' : ''"
				class="uni-input border-bottom py-3 p-0"
				placeholder="请输入密码"
				placeholder-class="text-light-muted"
			/>
			<view class="font" style="margin: 80rpx 0;">
				<text>用手机短信登录</text>
				<text class="iconfont icon-you font-sm"></text>
			</view>
			<view class="d-flex a-center j-center text-white main-bg-hover-color mb-2 rounded" style="height: 85rpx;" hover-class="main-bg-color" @click="submit">登录</view>
			<label class="uniui-checkbox radio" @click="check = !check">
				<checkbox :checked="check" class="rounded" color="#f0d2a2" style="transform:scale(0.6)" />
				<text>已阅读xxxx协议</text>
			</label>
		</view>
	</view>
</template>

<script>
import uniStatusBar from '@/components/uni-ui/uni-status-bar/uni-status-bar.vue';
import card from '@/components/common/card.vue';

import {mapMutations,mapActions} from 'vuex'
export default {
	data() {
		return {
			username: '',
			password: '',
			check: false,
			input: {
				userNameFlag: false,
				pwdFlag: false
			},
			rules: {
				username: [
					{
						rule: /^[a-zA-Z]\w{4,17}$/,
						msg: '账号必须字母开头，长度在4~18之间，只能包含字母、数字和下划线'
					}
				],
				password: [
					{
						rule: /^.{5,20}$/,
						msg: '密码长度必须为5-20个字符'
					}
				]
			}
		};
	},
	components: {
		uniStatusBar,
		card
	},
	methods: {
		...mapMutations('userModule',['login']),
		...mapActions('cartModule',['updateCartData']),
		//返回
		back(){
			uni.navigateBack({delta:1})
		},
		//表单验证
		validate(key) {
			let check = true;
			this.rules[key].forEach(i => {
				if (!(i.rule).test(this[key])) {
					uni.showToast({title: i.msg,icon:'none'});
					check=false
					return false;
				}
			});
			return check;
		},
		//登录
		submit() {
			this.username=this.username.trim()
			this.password=this.password.trim()
			if (!this.validate('username')) return;
			if (!this.validate('password')) return;
			if (!this.check) {
				return uni.showToast({
					title: '请先同意XXXXX协议',
					icon: 'none'
				});
			}
			uni.showLoading({
				title:'登录中...',
				mask:true
			})
			this._api.post('login',{username:this.username,password:this.password}).then(res=>{
				this.username=''
				this.password=''
				this.login(res)
				this.updateCartData()
				uni.hideLoading()
				
				uni.navigateBack({delta:1})
				uni.showToast({
					title: '登录成功',
					icon:'none'
				});
			})
		},
		focus(type) {
			if (type === 'pwd') return (this.input.pwdFlag = true);
			this.input.userNameFlag = true;
		},
		blur(type) {
			if (type === 'pwd') return (this.input.pwdFlag = false);
			this.input.userNameFlag = false;
		}
	}
};
</script>

<style scoped>
.input-active {
	border-color: #f0d2a2;
}
</style>
