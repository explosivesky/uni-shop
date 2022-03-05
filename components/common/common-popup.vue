<template>
	<view class="w-100">
		<!-- 弹出框 -->
		<view class="_popup" :class="popupClass">
			<view class="_mask" @click.top="$emit('hide')"></view>
			<view class="_body" @touchmove.stop.prevent="handler">
				<slot/>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			popupClass:{
				type:String,
				default:'none'
			}
		},
		methods:{
			handler(){}
		}
	}
</script>

<style scoped>
	._popup ,
	._mask{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1000;
	}
	._popup{
		z-index: 2000;
		display: none;
	}
	._mask{
		z-index: 2002;
		background-color: rgba(0,0,0,.5);
	}
	._popup ._body{
		position: fixed;
		bottom: -1035rpx;
		height: 1035rpx;
		width: 92%;
		padding: 0 4%;
		z-index: 2004;
		border-radius: 20rpx 20rpx 0 0;
		background-color: #fff;
		display: flex;
		flex-direction: column;
	}
	/* 不加空格是同级class */
	._popup.show{
		display: block;
	}
	.show ._body{
		animation: showPopupBody 0.2s linear both;
	}
	.show ._mask{
		animation: showPopupMask 0.2s linear both;
	}
	._popup.hide{
		display: block;
	}
	.hide ._body{
		animation: hidePopupBody 0.2s linear both;
	}
	.hide ._mask{
		animation: hidePopupMask 0.2s linear both;
	}
	._popup.none{
		display: none;
	}
	/* body 滑动动画 */
	@keyframes showPopupBody{
		0%{ transform: translateY(0);}
		100%{ transform: translateY(-100%);}
	}
	@keyframes hidePopupBody{
		0%{ transform: translateY(-100%);}
		100%{ transform: translateY(0);}
	}
	
	/* mask 显示隐藏动画 */
	@keyframes showPopupMask{
		0%{ opacity: 0;}
		100%{ opacity: 1;}
	}
	@keyframes hidePopupMask{
		0%{ opacity: 1;}
		100%{ opacity: 0;}
	}
</style>
