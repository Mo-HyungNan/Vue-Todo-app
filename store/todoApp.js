import Vue from 'vue'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import cryptoRandomString from 'crypto-random-string'
import _find from 'lodash/find'
import _assign from 'lodash/assign'
import _findIndex from 'lodash/findIndex'
import _cloneDeep from 'lodash/cloneDeep'
import _forEachRight from 'lodash/forEachRight'

export default {
    namespaced: true,
    state: () => ({
        db: null,
        todos: []
    }),
    getters: {
        total (state) {
            return state.todos.length  
        },
        activeCount (state) {
            return state.todos.filter(todo => !todo.done).length
        },
        completedCount (state, getters) {
            return getters.todos.length - getters.activeCount
        }
    },
    mutations: {
        assignDB (state, db) {
            state.db = db
        },
        createDB (state, newTodo) {
            state.db
                .get('todos') //lodash
                .push(newTodo) //lodash
                .write() //lowdb
        },
        updateDB (state, { todo, value }) {
            store.db
                .get('todos')
                .find({ id: todo.id })
                .assign(value)
                .write()
        },
        deleteDB (state, todo) {
            state.db
                .get('todos')
                .remove({ id: todo.id })
                .write()
        },
        assignTodos (state, todos) {
            state.todos = todos
        },
        pushTodo (state, newTodo) {
            state.todos.push(newTodo)
        },
        assignTodo (state, { foundTodo, value }) {
            _assign(foundTodo, value)
        },
        deleteTodo (state, foundIndex) {
            Vue.delete(state.todos, foundIndex)
        },
        updateTodo (state, { todo, key, value }) {
            todo[key] = value
        }
    },
    actions: {
        initDB ({ state, commit }) {
            const adapter = new LocalStorage('todo-app') // DB name
            //state.db = lowdb(adapter)
            commit('assignDB', lowdb(adapter))
      
            const hasTodos = state.db
              .has('todos') // Collection name
              .value()
      
            // 기존에 저장된 DB가 있는지 확인
            if (hasTodos) {
                //state.todos = _cloneDeep(state.db.getState().todos)
                commit('assignTodos', _cloneDeep(state.db.getState().todos))
            } else {
                // Local DB 초기화
                state.db
                    .defaults({
                    todos: []
                    })
                    .write()
            }
        },
        createTodo ({ state, commit }, title) {
            const newTodo = {
                id: cryptoRandomString({ length: 10 }),
                title,
                createdAt: new Date(),
                updatedAt: new Date(),
                done: false
            }

            //Create DB
            commit('createDB', newTodo)

            //Create Client
            commit('pushTodo', newTodo)
        },
        updateTodo ({ store, commit }, { todo, value }) {
            // UpdateDB
            commit('updateDB', { todo, value })

            const foundTodo = _find(store.todos, { id: todo.id })
            commit('assignTodo', { foundTodo, value })
        },
        deleteTodo ({ state, commit }, todo) {
            //DeleteDB
            commit('deleteDB', todo)
      
            // 로컬(local)에 반영
            // Lodash 라이브러리 활용
            const foundIndex = _findIndex(state.todos, { id: todo.id })
            
            //Delete Client
            commit('deleteTodo', foundIndex)
        },
        completeAll ({ state, commit }, checked) {
            const newTodos = state.db
                .get('todos')
                .forEach(todo => {
                    //todo.done = checked
                    commit('updateTodo', {
                        todo,
                        key: 'done',
                        value: checked
                    })
                })
                .write() // 수정된 `todos` 배열을 반환합니다.
      
            state.todos = _cloneDeep(newTodos)
        },
        clearCompleted ({ state, dispatch }) {
            _forEachRight(state.todos, todo => {
                if (todo.done) {
                    //state.deleteTodo(todo)
                    dispatch('deleteTodo', todo)
                }
            })
        }
    }
}