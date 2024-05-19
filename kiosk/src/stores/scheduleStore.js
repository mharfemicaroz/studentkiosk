// stores/scheduleStore.js
import { defineStore } from "pinia";

export const useScheduleStore = defineStore("schedule", {
  state: () => ({
    schedules: null,
  }),
  actions: {
    setSchedules(schedules) {
      this.schedules = schedules;
    },
    clearSchedules() {
      this.schedules = null;
    },
  },
});
