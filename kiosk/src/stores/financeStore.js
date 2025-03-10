import { defineStore } from "pinia";

export const useFinanceStore = defineStore("finance", {
  state: () => ({
    installment: null,
    assessment: null,
    payment: null,
    schedule: null,
  }),
  actions: {
    setInstallment(installment) {
      this.installment = installment;
    },
    clearInstallment() {
      this.installment = null;
    },
    setAssessment(assessment) {
      this.assessment = assessment;
    },
    clearAssessment() {
      this.assessment = null;
    },
    setPayment(payment) {
      this.payment = payment;
    },
    clearPayment() {
      this.payment = null;
    },
    setSchedule(schedule) {
      this.schedule = schedule;
    },
    clearSchedule() {
      this.schedule = null;
    },
  },
});
