<template>
	<view class="d-inline-block border mr-2 mb-2 p-1-5" :style="getStyle" @click="$emit('click')">
		{{item.name}}
	</view>
</template>

<script>
	export default{
		props:{
			item:Object,
			color:{
				type:Boolean,
				default:true
			}
		},
		computed:{
			getStyle(){
				if(!this.color){
					return `border:none; background-color:#f5f5f5;`
				}
					let color={
						borderColor:[ '#EEA6AA','#DD6A4B','#98D5D8','#9DBE93','#BCCD99' ],
						background:[ '#F8EAE9','#FFBEC6','#E8F6F6','#E4F5E2','#F2F6E8' ],
					}
					let index =Math.floor(Math.random()*color.borderColor.length)
					let borderColor =color.borderColor[index]
					let background =color.background[index]
					return `background-color: ${background}; border-color: ${borderColor};`
			}
		},
	}
</script>

<style>
</style>
