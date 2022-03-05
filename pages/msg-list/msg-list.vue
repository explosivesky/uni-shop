<template>
	<view class="px-2">
		<view class="d-flex flex-column font text-light-muted mt-2 p-2 bg-white" v-for="(item,index) in list" :key="index" @click="openToArticle(item)">
			<view class="text-dark uni-ellipsis">{{item.title}}</view>
			<view class="uni-ellipsis">{{item.content}}</view>
			<view class="uni-ellipsis">{{item.create_time}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[
					{
						title:'标题',
						content:'内容',
						create_time:'5月28哈'
					},
					{
						title:'标题',
						content:'内容',
						create_time:'5月28哈'
					},
					{
						title:'标题',
						content:'内容',
						create_time:'5月28哈'
					},
					{
						title:'标题',
						content:'内容',
						create_time:'5月28哈'
					}
				]
			}
		},
		methods: {
			openToArticle(item){
				uni.navigateTo({
					url:"/pages/msg-article/msg-article?detail="+JSON.stringify(item)
				})
			}
		}
	}
</script>

<style>
page{
	background-color: #efefef;
}
</style>
