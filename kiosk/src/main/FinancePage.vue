<template>
  <div class="row">
    <div class="col-md-6">
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
                  item.remarks !== "Per Sy"
                    ? item.amount * totalUnits
                    : item.amount
                }}
              </td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <td>Sub-total:</td>
              <td style="text-align: right">
                {{
                  assessment.find((o) => o.type === "tuition")?.remarks !==
                  "Per Sy"
                    ? assessment.find((o) => o.type === "tuition")?.amount *
                      totalUnits
                    : assessment.find((o) => o.type === "tuition")?.amount
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
                      "Per Sy"
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
    <div class="col-md-6">
      <h6>Payment History</h6>
      <div class="table-responsive">
        <table class="table mb-0">
          <thead class="thead-light">
            <tr>
              <th scope="col">OR No</th>
              <th scope="col">Cashier</th>
              <th scope="col">Date</th>
              <th style="text-align: right" scope="col">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in payments" :key="index">
              <td>{{ item.orno }}</td>
              <td>{{ item.cashier }}</td>
              <td>{{ item.formatdate }}</td>
              <td style="text-align: right">{{ item.cash }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">Sub-total:</td>
              <td style="text-align: right">
                {{ net }}
              </td>
            </tr>
            <tr>
              <td colspan="3">Balance:</td>
              <td style="text-align: right">
                {{ balance }}
              </td>
            </tr>
          </tfoot>
        </table>
        <table class="table mb-0">
          <thead class="thead-light">
            <tr>
              <th scope="col" colspan="3">Installment</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(installment, index) in installmentDetails" :key="index">
              <td>{{ installment.period }}</td>
              <td>{{ installment.paid ? "Paid" : "Not Paid" }}</td>
              <td style="text-align: right">{{ installment.amount }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2">Balance:</td>
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
import {
  viewAssessment,
  viewPayments,
  countExams,
} from "@/services/financeServices";
import { viewSchedule } from "@/services/scheduleServices";
export default {
  data() {
    return {
      installment: 0,
      assessment: [],
      payments: [],
      schedules: [],
    };
  },
  methods: {
    async loadData() {
      const authStore = useAuthStore();
      let type = "";
      if (authStore.user[0].category.toLowerCase() === "college") {
        type = "college";
      } else {
        type = "shs_jhs";
      }

      this.installment = parseFloat((await countExams(type)).n);

      this.assessment = await viewAssessment({
        crs: authStore.user[0].coursecode,
        mjr: authStore.user[0].major,
        lvl: authStore.user[0].yrlevel,
        sy: "2023-2024",
        sem: "2nd Semester",
      });
      this.schedules = await viewSchedule({
        studentno: authStore.user[0].studentno,
        sy: "2023-2024",
        semester: "2nd semester",
      });
      this.payments = await viewPayments({
        transid: authStore.user[0].studentno + "2023-20242NDSEMESTER",
      });
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
          "Per Sy"
            ? this.assessment.find((o) => o.type === "tuition")?.amount *
              this.totalUnits
            : this.assessment.find((o) => o.type === "tuition")?.amount)) /
        this.installment;

      const details = [];
      for (let i = 0; i < this.installment; i++) {
        const paid = this.net >= (i + 1) * installmentAmount;
        details.push({
          amount: Math.round(installmentAmount * 100) / 100,
          paid: paid,
          period: `${i + 1}${["st", "nd", "rd"][((i + 1) % 10) - 1] || "th"}`,
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
            "Per Sy"
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
    this.loadData();
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
