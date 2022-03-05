<template>
	<view class="ml-2 border px-2 py-1 rounded" hover-class="bg-light-secondary" @click.stop="$emit('click')">
		<slot/>
	</view>
</template>

<script>
	export default{
	}
</script>

<style>
</style>
