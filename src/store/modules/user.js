import axios from "axios";
const state = {
    users:[],
    salesman:[],
    influencers:[]
};
const getters = {};

const actions = {
    getUsers( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/users")
        .then(response => {
            commit('setUsers', response.data.data);
        });
    },
    getSalesman( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/users?filter[roles.name]=Talent Agent Manager,Talent Agent,Key Account Management Manager,Key Account Management,Booking Manager,Booking,Administrador")
        .then(response => {
            commit('setSalesman', response.data.data);
        });
    },
    getInfluencer( {commit} ){
        axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/influencers?filter[is_booking]=0&itemsPerPage=100")
        .then(response => {
            commit('setInfluencer', response.data.data);
        });
    }
};

const mutations = {
    setUsers(state, data){
        state.users = data;
    },
    setSalesman(state, data){
        state.salesman = data;
    },
    setInfluencer(state, data){
        state.influencers = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}