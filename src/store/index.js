import Vue from 'vue';
import Vuex from 'vuex'; //引入 vuex

Vue.use(Vuex); //使用 vuex

const store = new Vuex.Store({
    state:{//定义仓库内所有的状态
        count: 0,
        updateXinfangjianId:0, // 更新信访件所需id
        processInstanceId:0, // 线索处置 查看详细信息所用
    },
    mutations:{
        increment(state,x){
            state.count  = x
        },

        updateXinfangjianIdHandle(state,x){
            state.updateXinfangjianId = x
        },

        processInstanceIdHandle(state,x){
            state.processInstanceId = x
        }
    },
})
export default store