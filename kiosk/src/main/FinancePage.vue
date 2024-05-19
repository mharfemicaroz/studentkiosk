<template>
  <div class="row mb-3">
    <div v-if="loading" class="spinner-overlay">
      <div class="spinner"></div>
    </div>
    <div class="col-6">
      <div class="container">
        <form class="form-inline">
          <div class="form-group">
            <label for="semester" class="sr-only">Select Semester/Period</label>
            <select
              id="semester"
              class="form-control mr-2"
              v-model="semester"
              @change="handleSemesterChange"
            >
              <option value="">Select Semester/Period</option>
              <option
                v-for="semester in semesters"
                :value="semester"
                :key="semester"
              >
                {{ semester }}
              </option>
            </select>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-md-4">
      <h6>Assessment Details</h6>
      <div class="table-responsive">
        <table class="table">
          <thead class="thead-light">
            <tr>
              <th colspan="2" scope="col" style="width: 100%">Tuition</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in assessment.filter(
                (o) => o.type === 'tuition'
              )"
              :key="index"
            >
              <td style="width: 90%">{{ item.name }}</td>
              <td style="width: 10%; text-align: right">
                {{
                  Math.round(
                    (item.remarks !== "Per SY"
                      ? item.amount * totalUnits
                      : item.amount) * 100
                  ) / 100
                }}
              </td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <td>Sub-total:</td>
              <td style="text-align: right">
                {{
                  Math.round(
                    (assessment.find((o) => o.type === "tuition")?.remarks !==
                    "Per SY"
                      ? assessment.find((o) => o.type === "tuition")?.amount *
                        totalUnits
                      : assessment.find((o) => o.type === "tuition")?.amount) *
                      100
                  ) / 100
                }}
              </td>
            </tr>
          </tfoot>
        </table>
        <table class="table">
          <thead class="thead-light">
            <tr>
              <th colspan="2" scope="col" style="width: 100%">
                Registration Fee(s)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in assessment.filter(
                (o) => o.type === 'regfee'
              )"
              :key="index"
            >
              <td style="width: 90%">{{ item.name }}</td>
              <td style="width: 10%; text-align: right">
                {{ item.amount }}
              </td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <td>Sub-total:</td>
              <td style="text-align: right">
                {{
                  assessment
                    .filter((o) => o.type === "regfee")
                    .reduce((acc, item) => acc + parseFloat(item.amount), 0)
                }}
              </td>
            </tr>
          </tfoot>
        </table>
        <table class="table">
          <thead class="thead-light">
            <tr>
              <th colspan="2" scope="col" style="width: 100%">
                Miscellaneous Fees
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in assessment.filter(
                (o) => o.type === 'misc' && o.remarks === 'n/a'
              )"
              :key="index"
            >
              <td style="width: 90%">{{ item.name }}</td>
              <td style="width: 10%; text-align: right">
                {{ item.amount }}
              </td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <td>Sub-total:</td>
              <td style="text-align: right">
                {{
                  assessment
                    .filter((o) => o.type === "misc" && o.remarks === "n/a")
                    .reduce((acc, item) => acc + parseFloat(item.amount), 0)
                }}
              </td>
            </tr>
          </tfoot>
        </table>
        <table class="table">
          <thead class="thead-light">
            <tr>
              <th colspan="2" scope="col" style="width: 100%">Other Fees</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in assessment.filter(
                (o) => o.type === 'otherfee' && o.remarks === 'n/a'
              )"
              :key="index"
            >
              <td style="width: 90%">{{ item.name }}</td>
              <td style="width: 10%; text-align: right">
                {{ item.amount }}
              </td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <td>Sub-total:</td>
              <td style="text-align: right">
                {{
                  assessment
                    .filter((o) => o.type === "otherfee" && o.remarks === "n/a")
                    .reduce((acc, item) => acc + parseFloat(item.amount), 0)
                }}
              </td>
            </tr>
            <tr>
              <td>Total:</td>
              <td style="text-align: right">
                {{
                  Math.round(
                    (assessment
                      .filter(
                        (o) => o.type !== "tuition" && o?.remarks === "n/a"
                      )
                      .reduce((acc, item) => acc + parseFloat(item.amount), 0) +
                      (assessment.find((o) => o.type === "tuition")?.remarks !==
                      "Per SY"
                        ? assessment.find((o) => o.type === "tuition")?.amount *
                          totalUnits
                        : assessment.find((o) => o.type === "tuition")
                            ?.amount)) *
                      100
                  ) / 100
                }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
    <div class="col-md-8">
      <h6>Payment History</h6>
      <div class="table-responsive">
        <table class="table mb-0">
          <thead class="thead-light">
            <tr>
              <th scope="col">OR No</th>
              <th scope="col">Cashier</th>
              <th scope="col">Date</th>
              <th scope="col">Type</th>
              <th scope="col">Remarks</th>
              <th style="text-align: right" scope="col">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in payments" :key="index">
              <td>{{ item.orno }}</td>
              <td>{{ item.cashier }}</td>
              <td>{{ item.formatdate }}</td>
              <td>{{ item._log }}</td>
              <td>{{ item.remarks }}</td>
              <td style="text-align: right">{{ item.cash }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="5">Sub-total:</td>
              <td style="text-align: right">
                {{ net }}
              </td>
            </tr>
            <tr>
              <td colspan="5">Balance:</td>
              <td style="text-align: right">
                {{ balance }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <h6>Installment</h6>
      <div class="table-responsive">
        <table class="table mb-0">
          <thead class="thead-light">
            <tr>
              <th scope="col">Period</th>
              <th scope="col">Status</th>
              <th scope="col">Payment</th>
              <th scope="col" style="text-align: right">Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(installment, index) in installmentDetails" :key="index">
              <td>{{ installment.period }}</td>
              <td>{{ installment.paid ? "Paid" : "Not Paid" }}</td>
              <td>{{ installment.amount }}</td>
              <td style="text-align: right">{{ installment.balance }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">Balance:</td>
              <td style="text-align: right">
                {{ balance }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import { useAuthStore } from "@/stores/authStore";
import { useConfigStore } from "@/stores/configStore";
import { useFinanceStore } from "@/stores/financeStore";
import {
  viewAssessment,
  viewPayments,
  countExams,
} from "@/services/financeServices";
import { viewSchedule } from "@/services/scheduleServices";
import { viewSYSEM } from "@/services/configServices";
export default {
  data() {
    return {
      sy: "",
      sem: "",
      type: "",
      semester: "",
      installment: 0,
      assessment: [],
      payments: [],
      schedules: [],
      semesters: [],
      loading: true,
      activateSelect: false,
    };
  },
  methods: {
    async loadData() {
      const currentYear = new Date().getFullYear();
      const authStore = useAuthStore();
      const configStore = useConfigStore();
      const financeStore = useFinanceStore();
      const userCategory = authStore.user[0].category.toLowerCase();

      this.type =
        userCategory === "college" || userCategory === "techvoch"
          ? "college"
          : "shs_jhs";

      try {
        if (
          configStore.configs &&
          financeStore.installment &&
          financeStore.schedule &&
          financeStore.assessment &&
          !this.activateSelect
        ) {
          const config = configStore.configs;
          this.sy = config[0].sy;
          this.sem = config[0].sem;

          this.installment = financeStore.installment;
          this.assessment = financeStore.assessment;
          this.schedules = financeStore.schedule;
          this.payments = financeStore.payment;
        } else {
          if (!this.activateSelect) {
            const config = await viewSYSEM();
            this.sy = config[0].sy;
            this.sem = config[0].sem;
          }

          const courseDetails = {
            crs: authStore.user[0].coursecode,
            mjr: authStore.user[0].major,
            lvl: authStore.user[0].yrlevel,
            sy: this.sy,
            sem: this.sem,
          };

          const studentDetails = {
            studentno: authStore.user[0].studentno,
            sy: this.sy,
            semester: this.sem,
          };

          this.installment = parseFloat((await countExams(this.type)).n);
          this.assessment = await viewAssessment(courseDetails);
          this.schedules = await viewSchedule(studentDetails);
          this.payments = await viewPayments({
            transid:
              authStore.user[0].studentno +
              `${this.sy}${this.sem.trim().replace(/\s+/g, "").toUpperCase()}`,
          });

          financeStore.setInstallment(this.installment);
          financeStore.setAssessment(this.assessment);
          financeStore.setSchedule(this.schedules);
          financeStore.setPayment(this.payments);
          configStore.setConfig([{ sy: this.sy, sem: this.sem }]);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        this.loading = false;
      }

      this.semester =
        userCategory === "college" || userCategory === "techvoch"
          ? `${this.sem} ${currentYear - 1}-${currentYear}`
          : `SY ${currentYear - 1}-${currentYear}`;
    },

    populateSemesters() {
      const currentYear = new Date().getFullYear();
      const startYear = currentYear - 10;
      const semesters = [];

      for (let year = currentYear; year >= startYear; year--) {
        if (this.type === "shs_jhs") {
          semesters.push(`${year - 1}-${year}`);
        } else {
          semesters.push(`Summer ${year - 1}-${year}`);
          semesters.push(`2nd Semester ${year - 1}-${year}`);
          semesters.push(`1st Semester ${year - 1}-${year}`);
        }
      }

      this.semesters = semesters;
    },
    handleSemesterChange(event) {
      this.activateSelect = true;
      const selectedSemester = event.target.value;
      if (this.type === "college") {
        if (selectedSemester.includes("Summer")) {
          this.sem = "Summer";
          this.sy = selectedSemester.split(" ")[1];
        } else {
          const parts = selectedSemester.split(" ");
          this.sem = `${parts[0]} ${parts[1]}`;
          this.sy = parts[2];
        }
      } else {
        this.sy = selectedSemester;
      }

      this.loadData();
    },
    loadScript(scriptName, scriptSource) {
      const scriptId = `script-${scriptName}`;
      if (document.getElementById(scriptId)) {
        console.log("Script already loaded:", scriptName);
        return; // Script already loaded
      }
      let script = document.createElement("script");
      script.id = scriptId;
      script.src = scriptSource;
      document.head.appendChild(script);
    },
  },
  computed: {
    installmentDetails() {
      const installmentAmount =
        (this.assessment
          .filter((o) => o.type !== "tuition" && o?.remarks === "n/a")
          .reduce((acc, item) => acc + parseFloat(item.amount), 0) +
          (this.assessment.find((o) => o.type === "tuition")?.remarks !==
          "Per SY"
            ? this.assessment.find((o) => o.type === "tuition")?.amount *
              this.totalUnits
            : this.assessment.find((o) => o.type === "tuition")?.amount) -
          this.payments
            .filter((o) => o._log === "DOWN_PAYMENT")
            .reduce((acc, item) => acc + parseFloat(item.cash), 0)) /
        this.installment;

      const details = [];
      let runningBalance = installmentAmount * this.installment;

      for (let i = 0; i < this.installment; i++) {
        const paid = this.net >= (i + 1) * installmentAmount;
        const amount = Math.round(installmentAmount * 100) / 100;
        runningBalance -= Math.round(amount * 100) / 100;
        details.push({
          amount: amount,
          paid: paid,
          period: `${i + 1}${["st", "nd", "rd"][((i + 1) % 10) - 1] || "th"}`,
          balance:
            Math.round(Math.round(runningBalance * 100) / 100) <= 0
              ? 0
              : Math.round(runningBalance * 100) / 100,
        });
      }
      return details;
    },
    net() {
      return this.payments.reduce(
        (acc, item) => acc + parseFloat(item.cash),
        0
      );
    },
    balance() {
      return (
        Math.round(
          (this.assessment
            .filter((o) => o.type !== "tuition" && o?.remarks === "n/a")
            .reduce((acc, item) => acc + parseFloat(item.amount), 0) +
            (this.assessment.find((o) => o.type === "tuition")?.remarks !==
            "Per SY"
              ? this.assessment.find((o) => o.type === "tuition")?.amount *
                this.totalUnits
              : this.assessment.find((o) => o.type === "tuition")?.amount) -
            this.payments.reduce(
              (acc, item) => acc + parseFloat(item.cash),
              0
            )) *
            100
        ) / 100
      );
    },
    totalUnits() {
      return this.schedules.reduce(
        (acc, item) => acc + parseFloat(item.units),
        0
      );
    },
  },
  async created() {
    await this.loadData();
    this.populateSemesters();
  },
  mounted() {
    this.loadScript("script1", "/js/vendor.min.js");
    this.loadScript("script2", "/libs/morris-js/morris.min.js");
    this.loadScript("script3", "/libs/morris-js/morris.min.js");
    this.loadScript("script4", "/libs/raphael/raphael.min.js");
    this.loadScript("script5", "/js/pages/dashboard.init.js");
    this.loadScript("script6", "/js/app.min.js");
  },
};
</script>
<style scoped>
tfoot {
  font-weight: bold;
}
</style>
