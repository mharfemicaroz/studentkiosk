// stores/scheduleStore.js
import { defineStore } from "pinia";

export const useConfigStore = defineStore("config", {
  state: () => ({
    configs: null,
  }),
  actions: {
    setConfig(configs) {
      this.configs = configs;
    },
    clearConfig() {
      this.configs = null;
    },
  },
});
