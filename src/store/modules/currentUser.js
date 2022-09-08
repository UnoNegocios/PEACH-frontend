import axios from "axios";
const state = {
  user: {},
  sale_filter:'',
  client_filter:'',
};
const getters = {};
const actions = {
  getUser({ commit }) {
    axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/user/current", ).then(response => {
      var currentUser = response.data.data
        switch(currentUser.role){
            case 'Talent Agent':
                var sale_filter = ''//"filter[influencer_id]=" + currentUser.agents_assigned.map(user=>user.id) + '&'//"filter[user_id]=" + currentUser.id
                var client_filter = ''//"filter[sales.influencer_id]=" + currentUser.agents_assigned.map(user=>user.id) + '&'//"filter[user_id]=" + currentUser.id
                commit('setSaleFilter', sale_filter);
                commit('setClientFilter', client_filter);
                commit("setUser", currentUser);
            break;

            case 'Talent Agent Manager':
                var sale_filter = ''//"filter[influencer_id]=" + currentUser.agents_assigned.map(agents=>agents.influencers_assigned.map(influencer=>influencer.id)) + '&'//"filter[user_id]=" + currentUser.id
                var client_filter = ''//"filter[sales.influencer_id]=" + currentUser.agents_assigned.map(agents=>agents.influencers_assigned.map(influencer=>influencer.id)) + '&'//"filter[user_id]=" + currentUser.id
                commit('setSaleFilter', sale_filter);
                commit('setClientFilter', client_filter);
                commit("setUser", currentUser);
            break;

            case 'Booking':
                var sale_filter = ''//"filter[influencer_id]=" + currentUser.agents_assigned.map(user=>user.id) + '&'//"filter[user_id]=" + currentUser.id
                var client_filter = ''//"filter[sales.influencer_id]=" + currentUser.agents_assigned.map(user=>user.id) + '&'//"filter[user_id]=" + currentUser.id
                commit('setSaleFilter', sale_filter);
                commit('setClientFilter', client_filter);
                commit("setUser", currentUser);
            break;

            case 'Booking Manager':
                var sale_filter = ''//"filter[influencer_id]=" + currentUser.agents_assigned.map(agents=>agents.influencers_assigned.map(influencer=>influencer.id)) + '&'//"filter[user_id]=" + currentUser.id
                var client_filter = ''//"filter[sales.influencer_id]=" + currentUser.agents_assigned.map(agents=>agents.influencers_assigned.map(influencer=>influencer.id)) + '&'//"filter[user_id]=" + currentUser.id
                commit('setSaleFilter', sale_filter);
                commit('setClientFilter', client_filter);
                commit("setUser", currentUser);
            break;

            case 'Key Account Management':
                var sale_filter = ''//"filter[user_id]=" + currentUser.id + '&'
                var client_filter = ''//"filter[user_id]=" + currentUser.id + '&'
                commit('setSaleFilter', sale_filter);
                commit('setClientFilter', client_filter);
                commit("setUser", currentUser);
            break;

            case 'Key Account Management Manager':
              var sale_filter = ''//"filter[user_id]=" + currentUser.agents_assigned.map(user=>user.id) + ',' + currentUser.id + '&'
              var client_filter = ''//"filter[user_id]=" + currentUser.agents_assigned.map(user=>user.id) + ',' + currentUser.id + '&'
              commit('setSaleFilter', sale_filter);
              commit('setClientFilter', client_filter);
              commit("setUser", currentUser);
            break;

            case 'Administrador':
                var sale_filter = ''
                var client_filter = ''
                commit('setSaleFilter', sale_filter);
                commit('setClientFilter', client_filter);
                commit("setUser", currentUser);
            break;
        }
    });
  },
  loginUser({}, user) {
    axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/user/login", {
        email: user.email,
        password: user.password
      })
      .then(response => {
        if (response.data.access_token) {
          localStorage.setItem("xn8(*&^%$#47b*g3f76gw3*&^fn734gf8q*&^&^&mwmeg934g8whmre7ngN&G#*!NG@*&#GF(!*#gm1n428fm1g3n84gmf*^$&(%$)e3298negmg", response.data.access_token);
          localStorage.removeItem("nosepudo");
          window.location.replace("#/");
          location.reload();
        }else{
          localStorage.setItem("nosepudo", false);
        }
      })
  },
  logoutUser() {
    localStorage.removeItem("xn8(*&^%$#47b*g3f76gw3*&^fn734gf8q*&^&^&mwmeg934g8whmre7ngN&G#*!NG@*&#GF(!*#gm1n428fm1g3n84gmf*^$&(%$)e3298negmg");
    window.location.replace("#/");
    location.reload();
  }
};
const mutations = {
  setUser(state, data) {
    state.user = data;
  },
  setSaleFilter(state, data){
    state.sale_filter = data;
  },
  setClientFilter(state, data){
    state.client_filter = data;
  }
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
