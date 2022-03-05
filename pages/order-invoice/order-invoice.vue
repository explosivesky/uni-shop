<template>
	<view>
		<card headTitle="发票类型" :showCover="false" class="px-2">
			<radio-groups :label="label" :selected.sync="label.selected" class="mt-3"></radio-groups>
			<view class="font text-light-muted">电子发票与纸质发票具有相同的法律效力，可作为报销、售后、维权凭证，推荐使用电子发票，不怕丢失，更方便，环保。</view>
		</card>
		<card headTitle="发票抬头" :showCover="false" class="px-2">
			<radio-groups :label="label2" class="mt-3" :selected.sync="label2.selected"></radio-groups>
		</card>
	</view>
</template>

<script>
	import card from '@/components/common/card.vue'
	import radioGroups from '@/components/common/radio-groups.vue'
	export default {
		data() {
			return {
				label:{
					selected:0,
					list:[{
						name:'电子发票'
					}]
				},
				label2:{
					selected:0,
					list:[{
						name:'个人'
					},
					{
						name:'单位'
					}]
				}
			}
		},
		components:{
			card,
			radioGroups
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
