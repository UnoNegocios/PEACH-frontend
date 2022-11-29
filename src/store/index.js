import Vue from 'vue'
import Vuex from 'vuex'

import currentUser from "./modules/currentUser"
import rejection from "./modules/rejection"
import quotation from "./modules/quotation"
import origin from "./modules/origin"
import note from "./modules/note"
import log from "./modules/log"
import contact from "./modules/contact"
import company from "./modules/company"
import user from "./modules/user"
import status from "./modules/status"
import contact_mode from "./modules/contact_mode"
import influencer_payment from "./modules/influencer_payment"
import state from "./modules/state"
import city from "./modules/city"

import category from "./modules/category"


Vue.use(Vuex)

export default new Vuex.Store({
  //state: {},
  mutations: {
  },
  actions: {
  },
  modules: {
    state,
    city,
    influencer_payment,
    contact_mode,
    currentUser,
    rejection,
    quotation,
    origin,
    note,
    log,
    contact,
    company,
    user,
    status,
    category
  }
})
