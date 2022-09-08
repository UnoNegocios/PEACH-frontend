import axios from "axios";
const state = {
    quotations:[],
    cancellations:[],
    sales:[],
    totals:[],
    total_loader:false,
};
const getters = {};

const actions = {
    getQuotations( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/quotation/all")
        .then(response => {
            commit('setQuotations', response.data);
        });
    },
    getSales( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/quotation/sales")
        .then(response => {
            commit('setSales', response.data);
        });
    },
    getCancellations( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/quotation/cancellations")
        .then(response => {
            commit('setCancellations', response.data);
        });
    },
    getTotals( {commit}, selectedStatus ){
        state.total_loader = true
        var startDate = []
        var date = new Date()
        startDate[0] = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
        startDate[1] = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
        //return new Promise((resolve, reject) => {
        var link= ''
        if(this.selectedStatus!='all'&&this.selectedStatus!=undefined){
            link = link + 'filter[' + this.selectedStatus + ']=1'
        }
        if(localStorage.getItem('filtersSales')==undefined&&localStorage.getItem('filtersSales')==null){
            axios
            .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/totals/sales?"+link)//+'?filter[date_between]='+startDate)
            .then(response => {
                state.total_loader = false
                commit('setTotals', response.data);
            });
        }else{
            axios
            .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/totals/sales?"+ JSON.parse(localStorage.getItem('filtersSales'))+'&'+link)
            .then(response=>{
                state.total_loader = false
                commit('setTotals', response.data);
            })
        }
        //})
    },
};

const mutations = {
    setQuotations(state, data){
        state.quotations = data;
    },
    setCancellations(state, data){
        state.cancellations = data;
    },
    setSales(state, data){
        state.sales = data;
    },
    setTotals(state, data){
        state.totals = data;
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}