import Vue from 'vue'
import Vuex from 'vuex'
import cartModule from './modules/cartModule.js'
import pathModule from './modules/pathModule.js'
import userModule from './modules/userModule.js'
 Vue.use(Vuex)
let store = new Vuex.Store({
	modules:{
		cartModule,
		pathModule,
		userModule
	}
})
export default store