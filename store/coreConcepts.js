export default {
    namespaced: true,
    //Data
    state: () => ({
        a: 123,
        b: []
    }),
    //Computed
    getters: {
        someGetter1 (state, getters){
            return state.a + 1
        },
        someGetter2 (state, getters){
            return state.a + getters.somegetter1
        }
    },
    //Modules
    mutations: {
        someMutation (state, payload) {
            state.a = 789,
            state.b.push(payload)
        }
    },
    actions : {
        someAction1 ({ state, getters, commit, dispatch}, payload) {
            //state.a = 789 //Error
            //state.b.push(payload) // Error

            commit('someAction', payload)
        },
        someAction2 (context, payload){
            context.commit('someMutation')
            context.dispatch('someAction1', payload)
        }
    }
}