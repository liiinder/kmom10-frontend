import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: "",
        user: {},
        apiURL: "http://localhost:1338"
        // apiURL: "https://backend.liiinder.me"
    },

    mutations: { // syncronus
        setToken(state, token) {
            state.token = token;
        },
        setUser(state, user) {
            state.user = user;
        }
    },

    actions: { // asyncronous
        setToken(state, token) {
            state.commit("setToken", token);
        },
        setUser(state, user) {
            state.commit("setUser", user);
        }
    },

    getters: {
        getToken(state) {
            return state.token;
        },
        getUser(state) {
            return state.user;
        },
        apiURL(state) {
            return state.apiURL;
        }
    },
});