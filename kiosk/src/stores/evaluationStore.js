import { defineStore } from "pinia";

export const useEvaluationStore = defineStore("evaluation", {
  state: () => ({
    evaluations: null,
  }),
  actions: {
    setEvaluation(evaluations) {
      this.evaluations = evaluations;
    },
    clearEvaluation() {
      this.evaluations = null;
    },
  },
});
