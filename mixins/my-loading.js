export default {
	data(){
		return{
			beforeReady:true
		}
	},
	onReady() {
		// let timer = setTimeout(()=>{
		// 	this.$nextTick(()=>{
		// 		this.beforeReady=false
		// 		clearTimeout(timer)
		// 		timer=null
		// 	})
		// },500)
	}
}