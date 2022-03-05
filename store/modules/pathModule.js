import $API from '@/network/request.js'
let pathModel={
	state:{
		list:[]
	},
	mutations:{
		//是否追加数据并覆盖
		fullPath(state,{list,refresh=false}){
			//初始化时覆盖，添加时追加
			state.list = refresh ? [...list] : [...state.list,...list]
		},
		//增加收货地址
		addPath(state,item){
			state.list.unshift(item)
		},
		//删除收货地址
		deletePath(state,index){
			state.list.splice(index,1)
		},
		//修改收货地址
		editPath(state,{item,index}){
			//修改收货地址数据
			state.list[index] = item
		},
		removeDefault(state){
			//把之前的默认地址消除
			let has = state.list.findIndex(v=>v.isDefault)
			if(has>-1)state.list[has].isDefault=false
		}
	},
	actions:{
		//修改收货地址
		editPathAction({commit},payload){
			commit('removeDefault')
			commit('editPath',payload)
		},
		//添加收货地址
		addPathAction({commit},payload){
			commit('removeDefault')
			commit('addPath',payload)
		},
		//请求地址信息
		getPathData({commit},{page,refresh}){
			return new Promise((resolve,reject)=>{
				$API.get(`useraddresses/${page}`,{},{token:true}).then(res=>{
					//是否追加数据并覆盖
					commit('fullPath',{list:res,refresh})
					resolve(res)
				}).catch(err=>{
					reject()
				})
			})
			
		}
	},
	getters:{
		//获取默认地址
		getDefaultPath(state){
			return state.list[0].last_used_time == null ? false : state.list[0]
		}
	},
	namespaced:true
}
export default pathModel