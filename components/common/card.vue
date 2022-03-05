<template>
	<view>
		<!-- card -->
		<view class="card">
			<!-- 标题 -->
			<view class="d-flex j-sb a-center p-2" v-if="showhead" :class="getBorderBottom">
				<slot name="title">
					<view class="font-md main-border-color" :class="{'font-weight':titleWeight}" v-if="headTitle">
						{{headTitle}}
					</view>
				</slot>
			</view>
			<!-- body -->
			<view :class="getBodyClass" :style="bodyStyle">
					<image v-if="showCover" :src="bodyCover" mode="widthFix" class="image"></image>
					<slot/>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			bodyStyle:{
				type:String,
				default:''
			},
			headTitle:{
				type:String,
				default:''
			},
			bodyCover:{
				type:String,
				default:''
			},
			showhead:{
				type:Boolean,
				default:true
			},
			showCover:{
				type:Boolean,
				default:true
			},
			showBorderBottom:{
				type:Boolean,
				default:true
			},
			bodyPadding:{
				type:Boolean,
				default:true
			},
			titleWeight:{
				type:Boolean,
				default:true
			},
		},
		computed:{
			getBorderBottom(){
				let borderBottom= this.showBorderBottom ? 'border-bottom' : ''
				return `${borderBottom}`
			},
			getBodyClass(){
				let padding  = this.bodyPadding ? 'p-2' : ''
				return `{${padding}}`
			}
		}
	}
</script>

<style scoped>
	.image{
		height: 300rpx;
	}
</style>
