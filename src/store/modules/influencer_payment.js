import axios from "axios";
const state = {
    influencer_payments:[],
};
const getters = {};

const actions = {
    getInfluencerPayments( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/influencer_payment/all")
        .then(response => {
            commit('setInfluencerPayments', response.data);
        });
    }
};

const mutations = {
    setInfluencerPayments(state, data){
        state.influencer_payments = data;
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}