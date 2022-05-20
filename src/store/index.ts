import { mask } from "@/types/mask";
import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";

Vue.use(Vuex);

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootState {
  masks: mask[];
}

// window.localStorage.setItem("masks", JSON.stringify([{ test: "test" }]));

export default new Vuex.Store({
  state: {
    masks: JSON.parse(window.localStorage.getItem("masks") || "[]"),
  },
  mutations: {
    updateMaskList: (state, payload: mask[]) => {
      state.masks = payload;
      window.localStorage.setItem("masks", JSON.stringify(payload));
    },
  },
  getters: {},
  actions: {},
  modules: {},
} as StoreOptions<RootState>);
