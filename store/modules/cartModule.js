import api from '@/network/request.js'
import $U from '@/common/util.js'
let cartModule = {
	state:{
		popupShow:"none",
		popupIndex:-1,
		list: [],
		selectList:[],//选中列表(存放选中的id)
		skuList:[]
	},
	mutations:{
		//初始化购物车数据
		initCartData(state,list){
			state.list=list
			$U.updateNavbarBadge(state.list.length)
		},
		//添加到购物车
		addGoodsToCart(state,goods){
			state.list.unshift(goods)
			$U.updateNavbarBadge(state.list.length)
		},
		//全部选中
		selectAll(state){
			state.selectList = state.list.map(v=>{
				v.checked=true
				return v.id
			})
		},
		//全部取消选中
		unSelectAll(state){
			state.list.forEach(v=>{
				v.checked=false
			})
			state.selectList=[]
		},
		//选中单个商品购物车
		selectItem(state,index){
			let id = state.list[index].id
			let i = state.selectList.indexOf(id)
			//之前选中过
			if(i > -1){
				//取消选中
				state.list[index].checked=false
				return state.selectList.splice(i,1)
			}
			//选中当前项
			state.list[index].checked=true
			state.selectList.push(state.list[index].id)
		},
		//批量删除购物车商品
		deleteItem(state){
			state.list=state.list.filter(i=>{
				//如果找不到，就返回
				return state.selectList.indexOf(i.id) === -1 
			})
			$U.updateNavbarBadge(state.list.length)
		},
		//删除全部
		deleteAll(state){
			state.list=[]
			$U.updateNavbarBadge(state.list.length)
		},
		//初始化 popupIndex
		initPopupIndex(state,index){
			state.popupIndex=index
		},
		//清空购物车
		clearCartData(state){
			state.list=[]
			state.selectList=[]
			$U.updateNavbarBadge(state.list.length)
		}
	},
	actions:{
		//更新购物车信息
		updateCartData({commit},refresh){
			//请求购物车信息
			return new Promise((resolve,reject)=>{
				api.get('cart',{},{token:true,toast:true}).then(res => {
					//获取初始化购物车数据并保存到 vuex 中
					commit('initCartData',res)
					//取消全部选中样式
					commit('unSelectAll')
					resolve()
				}).catch(err=>{
					if(refresh){
						uni.showToast({
							title: '请先登录',
							icon:'none'
						});
						reject()
					}
				})
			})
		},
		//显示 popup
		doShowPopup({state,commit},{skuList,index,edit}){
			if(!edit)return 
			//显示之前获取对应索引的数据
			commit('initPopupIndex',index)
			state.skuList = skuList
			state.popupShow='show'
		},
		//隐藏 popup
		doHidePopup({state,commit}){
			state.popupShow='hide'
			commit('initPopupIndex',-1)
			let timer = setTimeout(()=>{
				state.popupShow='none'
				clearTimeout(timer)
				timer=null
			},200)
		},
		//全部选中/取消选中
		doSelectAll({commit,getters}){
			getters.isAll ? commit('unSelectAll') : commit('selectAll')
		},
		//删除
		deleteAction({commit,getters,state}){
			if(state.selectList.length===0){
				return uni.showToast({
					title: '请选择选中的商品',
					icon:'none'
				});
			}
			
			uni.showModal({
				content: '是否删除选中?',
				success:  (res) =>{
					if (res.confirm) {
						api.post('cart/delete',{shop_ids:state.selectList.join(',')},{token:true}).then(res=>{
							getters.isAll ? commit('deleteAll') : commit('deleteItem')//判断是否全部删除
							commit('unSelectAll')//清除所有选中状态
							uni.showToast({
								title: '删除成功'
							});
						})
					} 
				}
			});
		}
	},
	getters:{
		//动态购物车中的数据
		getCartInfo(state){
			return state.popupIndex > -1 ? state.list[state.popupIndex] : {}
		},
		//更改全选状态
		isAll(state){
			return state.list.length === state.selectList.length ? true : false
		},
		//获取总价格
		totalPrice(state){
			let total = 0
			state.list.forEach(v=>{
				if(state.selectList.indexOf(v.id) > -1){
					total+=v.pprice*v.num
				}
			})
			return parseFloat(total).toFixed(2)
		},
		//购物车没商品时禁用
		disabledSelectAll(state){
			// return state.list.length <= 0 ? false : true
			return state.list.length === 0 
		},
		//返回购物车数量
		GoodsCartCount(state){
			let count = state.list.length
			if(count <= 99){
				return count
			}
			return '99+'
		}
	},
	namespaced:true
}
export default cartModule