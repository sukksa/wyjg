import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: {},
    showLoading: false,
    commonInfo: {},
    tenantInfo: {}
  },
  getters: {},
  mutations: {
    save_user_info(state, info) {
      this.state.userInfo = info;
    },
    save_show_loading(state, info) {
      this.state.showLoading = info;
    },
    save_common_info(state, info) {
      this.state.commonInfo = info;
    },
    save_tenant_info(state, info) {
      this.state.tenantInfo = info;
    }
  },
  actions: {},
  modules: {}
});
