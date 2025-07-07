import { defineStore } from "pinia";

/**
 * Centralised store for all cash-flow charts.
 *
 * ─────────────────────────────────────────────────────────
 *  • `periodChartData`   – array from /chart/transactionReport/view
 *  • `courseChartData`   – array from /chart/transactionReport/by-course
 *  • each dataset keeps its own last-used payload (`query…Params`)
 */
export const useChartStore = defineStore("chart", {
  state: () => ({
    /* time-bucketed (daily / weekly / monthly / yearly) */
    periodChartData: [],
    periodQueryParams: null,

    /* grouped by course + major */
    courseChartData: [],
    courseQueryParams: null,
  }),

  actions: {
    /* ── period-based chart ─────────────────────────── */
    setPeriodChartData(data) {
      this.periodChartData = Array.isArray(data) ? data : [];
    },
    clearPeriodChartData() {
      this.periodChartData = [];
    },
    setPeriodQueryParams(params) {
      this.periodQueryParams = params;
    },
    clearPeriodQueryParams() {
      this.periodQueryParams = null;
    },

    /* ── course-/major-based chart ──────────────────── */
    setCourseChartData(data) {
      this.courseChartData = Array.isArray(data) ? data : [];
    },
    clearCourseChartData() {
      this.courseChartData = [];
    },
    setCourseQueryParams(params) {
      this.courseQueryParams = params;
    },
    clearCourseQueryParams() {
      this.courseQueryParams = null;
    },
  },
});
