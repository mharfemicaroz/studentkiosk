<template>
  <!-- Container with relative positioning to place the spinner overlay -->
  <div class="relative p-4">
    <!-- Spinner overlay when loading -->
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <div class="w-16 h-16 border-8 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
    </div>

    <!-- Top row: Select Semester/Period -->
    <div class="mb-4">
      <form class="flex items-center space-x-2">
        <label for="semester" class="sr-only">Select Semester/Period</label>
        <select id="semester"
          class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          v-model="semester" @change="handleSemesterChange">
          <option value="">Select Semester/Period</option>
          <option v-for="semesterItem in semesters" :value="semesterItem" :key="semesterItem">
            {{ semesterItem }}
          </option>
        </select>
      </form>
    </div>

    <!-- Two columns (stacked on mobile, side-by-side on md+ screens) -->
    <div class="flex flex-col md:flex-row md:space-x-4">
      <!-- Left Column (Assessment Details) -->
      <div class="md:w-1/3 mb-4 md:mb-0">
        <h6 class="text-lg font-semibold mb-2">Assessment Details</h6>

        <!-- ======================== TUITION FEES ======================== -->
        <div class="mb-4">
          <div class="mb-2 font-semibold">Tuition</div>
          <!-- Table (MD+) -->
          <div class="overflow-x-auto hidden md:block">
            <table class="min-w-full border border-gray-300 text-left">
              <thead class="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th colspan="2" class="px-4 py-2">Tuition</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in assessment.filter(
                  (o) => o.type === 'tuition'
                )" :key="index" class="border-b border-gray-200 hover:bg-gray-50">
                  <td class="px-4 py-2 w-4/5">{{ item.name }}</td>
                  <td class="px-4 py-2 w-1/5 text-right">
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
                  <td class="px-4 py-2 font-semibold">Sub-total:</td>
                  <td class="px-4 py-2 text-right font-semibold">
                    {{
                      Math.round(
                        (assessment.find((o) => o.type === "tuition")
                          ?.remarks !== "Per SY"
                          ? assessment.find((o) => o.type === "tuition")
                            ?.amount * totalUnits
                          : assessment.find((o) => o.type === "tuition")
                            ?.amount) * 100
                      ) / 100
                    }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Stacked layout (SM) -->
          <div class="block md:hidden space-y-2">
            <div v-for="(item, index) in assessment.filter(
              (o) => o.type === 'tuition'
            )" :key="index" class="border border-gray-300 rounded p-2 bg-white shadow-sm">
              <div>
                <span class="font-semibold">Name: </span>{{ item.name }}
              </div>
              <div>
                <span class="font-semibold">Amount: </span>
                {{
                  Math.round(
                    (item.remarks !== "Per SY"
                      ? item.amount * totalUnits
                      : item.amount) * 100
                  ) / 100
                }}
              </div>
            </div>
            <!-- Subtotal -->
            <div class="mt-2 font-semibold flex justify-between">
              <span>Sub-total:</span>
              <span>
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
              </span>
            </div>
          </div>
        </div>

        <!-- ======================== REGISTRATION FEES ======================== -->
        <div class="mb-4">
          <div class="mb-2 font-semibold">Registration Fee(s)</div>
          <!-- Table (MD+) -->
          <div class="overflow-x-auto hidden md:block">
            <table class="min-w-full border border-gray-300 text-left">
              <thead class="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th colspan="2" class="px-4 py-2">Registration Fee(s)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in assessment.filter(
                  (o) => o.type === 'regfee'
                )" :key="index" class="border-b border-gray-200 hover:bg-gray-50">
                  <td class="px-4 py-2 w-4/5">{{ item.name }}</td>
                  <td class="px-4 py-2 w-1/5 text-right">{{ item.amount }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td class="px-4 py-2 font-semibold">Sub-total:</td>
                  <td class="px-4 py-2 text-right font-semibold">
                    {{
                      assessment
                        .filter((o) => o.type === "regfee")
                        .reduce((acc, item) => acc + parseFloat(item.amount), 0)
                    }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Stacked layout (SM) -->
          <div class="block md:hidden space-y-2">
            <div v-for="(item, index) in assessment.filter(
              (o) => o.type === 'regfee'
            )" :key="index" class="border border-gray-300 rounded p-2 bg-white shadow-sm">
              <div>
                <span class="font-semibold">Name: </span>{{ item.name }}
              </div>
              <div>
                <span class="font-semibold">Amount: </span>
                {{ item.amount }}
              </div>
            </div>
            <!-- Subtotal -->
            <div class="mt-2 font-semibold flex justify-between">
              <span>Sub-total:</span>
              <span>
                {{
                  assessment
                    .filter((o) => o.type === "regfee")
                    .reduce((acc, item) => acc + parseFloat(item.amount), 0)
                }}
              </span>
            </div>
          </div>
        </div>

        <!-- ======================== MISCELLANEOUS FEES ======================== -->
        <div class="mb-4">
          <div class="mb-2 font-semibold">Miscellaneous Fees</div>
          <!-- Table (MD+) -->
          <div class="overflow-x-auto hidden md:block">
            <table class="min-w-full border border-gray-300 text-left">
              <thead class="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th colspan="2" class="px-4 py-2">Miscellaneous Fees</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in assessment.filter(
                  (o) => o.type === 'misc' && o.remarks === 'n/a'
                )" :key="index" class="border-b border-gray-200 hover:bg-gray-50">
                  <td class="px-4 py-2 w-4/5">{{ item.name }}</td>
                  <td class="px-4 py-2 w-1/5 text-right">{{ item.amount }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td class="px-4 py-2 font-semibold">Sub-total:</td>
                  <td class="px-4 py-2 text-right font-semibold">
                    {{
                      assessment
                        .filter((o) => o.type === "misc" && o.remarks === "n/a")
                        .reduce((acc, item) => acc + parseFloat(item.amount), 0)
                    }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Stacked layout (SM) -->
          <div class="block md:hidden space-y-2">
            <div v-for="(item, index) in assessment.filter(
              (o) => o.type === 'misc' && o.remarks === 'n/a'
            )" :key="index" class="border border-gray-300 rounded p-2 bg-white shadow-sm">
              <div>
                <span class="font-semibold">Name: </span>{{ item.name }}
              </div>
              <div>
                <span class="font-semibold">Amount: </span>
                {{ item.amount }}
              </div>
            </div>
            <!-- Subtotal -->
            <div class="mt-2 font-semibold flex justify-between">
              <span>Sub-total:</span>
              <span>
                {{
                  assessment
                    .filter((o) => o.type === "misc" && o.remarks === "n/a")
                    .reduce((acc, item) => acc + parseFloat(item.amount), 0)
                }}
              </span>
            </div>
          </div>
        </div>

        <!-- ======================== OTHER FEES ======================== -->
        <div class="mb-4">
          <div class="mb-2 font-semibold">Other Fees</div>
          <!-- Table (MD+) -->
          <div class="overflow-x-auto hidden md:block">
            <table class="min-w-full border border-gray-300 text-left">
              <thead class="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th colspan="2" class="px-4 py-2">Other Fees</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in assessment.filter(
                  (o) => o.type === 'otherfee' && o.remarks === 'n/a'
                )" :key="index" class="border-b border-gray-200 hover:bg-gray-50">
                  <td class="px-4 py-2 w-4/5">{{ item.name }}</td>
                  <td class="px-4 py-2 w-1/5 text-right">{{ item.amount }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td class="px-4 py-2 font-semibold">Sub-total:</td>
                  <td class="px-4 py-2 text-right font-semibold">
                    {{
                      assessment
                        .filter(
                          (o) => o.type === "otherfee" && o.remarks === "n/a"
                        )
                        .reduce((acc, item) => acc + parseFloat(item.amount), 0)
                    }}
                  </td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-semibold">Total:</td>
                  <td class="px-4 py-2 text-right font-semibold">
                    {{
                      Math.round(
                        (assessment
                          .filter(
                            (o) => o.type !== "tuition" && o.remarks === "n/a"
                          )
                          .reduce(
                            (acc, item) => acc + parseFloat(item.amount),
                            0
                          ) +
                          (assessment.find((o) => o.type === "tuition")
                            ?.remarks !== "Per SY"
                            ? assessment.find((o) => o.type === "tuition")
                              ?.amount * totalUnits
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

          <!-- Stacked layout (SM) -->
          <div class="block md:hidden space-y-2">
            <div v-for="(item, index) in assessment.filter(
              (o) => o.type === 'otherfee' && o.remarks === 'n/a'
            )" :key="index" class="border border-gray-300 rounded p-2 bg-white shadow-sm">
              <div>
                <span class="font-semibold">Name: </span>{{ item.name }}
              </div>
              <div>
                <span class="font-semibold">Amount: </span>
                {{ item.amount }}
              </div>
            </div>
            <!-- Subtotals & total -->
            <div class="mt-2 font-semibold">
              <!-- Sub-total for otherfee -->
              <div class="flex justify-between">
                <span>Sub-total:</span>
                <span>
                  {{
                    assessment
                      .filter(
                        (o) => o.type === "otherfee" && o.remarks === "n/a"
                      )
                      .reduce((acc, item) => acc + parseFloat(item.amount), 0)
                  }}
                </span>
              </div>
              <!-- Overall total with tuition, regfee, misc, etc. -->
              <div class="flex justify-between mt-1">
                <span>Total:</span>
                <span>
                  {{
                    Math.round(
                      (assessment
                        .filter(
                          (o) => o.type !== "tuition" && o.remarks === "n/a"
                        )
                        .reduce(
                          (acc, item) => acc + parseFloat(item.amount),
                          0
                        ) +
                        (assessment.find((o) => o.type === "tuition")
                          ?.remarks !== "Per SY"
                          ? assessment.find((o) => o.type === "tuition")
                            ?.amount * totalUnits
                          : assessment.find((o) => o.type === "tuition")
                            ?.amount)) *
                      100
                    ) / 100
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column (Payment History, Installment) -->
      <div class="md:w-2/3">
        <!-- ======================== PAYMENT HISTORY ======================== -->
        <h6 class="text-lg font-semibold mb-2">Payment History</h6>

        <!-- Table (MD+) -->
        <div class="overflow-x-auto mb-4 hidden md:block">
          <table class="min-w-full border border-gray-300 text-left">
            <thead class="bg-gray-100 border-b border-gray-300">
              <tr>
                <th scope="col" class="px-4 py-2">OR No</th>
                <th scope="col" class="px-4 py-2">Cashier</th>
                <th scope="col" class="px-4 py-2">Date</th>
                <th scope="col" class="px-4 py-2">Type</th>
                <th scope="col" class="px-4 py-2">Remarks</th>
                <th scope="col" class="px-4 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in payments" :key="index" class="border-b border-gray-200 hover:bg-gray-50">
                <td class="px-4 py-2">{{ item.orno }}</td>
                <td class="px-4 py-2">{{ item.cashier }}</td>
                <td class="px-4 py-2">{{ item.formatdate }}</td>
                <td class="px-4 py-2">{{ item._log }}</td>
                <td class="px-4 py-2">{{ item.remarks }}</td>
                <td class="px-4 py-2 text-right">{{ item.cash }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="5" class="px-4 py-2 font-semibold">Sub-total:</td>
                <td class="px-4 py-2 text-right font-semibold">{{ net }}</td>
              </tr>
              <tr>
                <td colspan="5" class="px-4 py-2 font-semibold">Balance:</td>
                <td class="px-4 py-2 text-right font-semibold">
                  {{ balance }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Stacked layout (SM) -->
        <div class="block md:hidden space-y-2 mb-4">
          <div v-for="(item, index) in payments" :key="index"
            class="border border-gray-300 rounded p-2 bg-white shadow-sm">
            <div><span class="font-semibold">OR No: </span>{{ item.orno }}</div>
            <div>
              <span class="font-semibold">Cashier: </span>{{ item.cashier }}
            </div>
            <div>
              <span class="font-semibold">Date: </span>{{ item.formatdate }}
            </div>
            <div><span class="font-semibold">Type: </span>{{ item._log }}</div>
            <div>
              <span class="font-semibold">Remarks: </span>{{ item.remarks }}
            </div>
            <div>
              <span class="font-semibold">Amount: </span>{{ item.cash }}
            </div>
          </div>
          <!-- Subtotals -->
          <div class="font-semibold flex justify-between">
            <span>Sub-total:</span>
            <span>{{ net }}</span>
          </div>
          <div class="font-semibold flex justify-between">
            <span>Balance:</span>
            <span>{{ balance }}</span>
          </div>
        </div>

        <!-- ======================== INSTALLMENT ======================== -->
        <h6 class="text-lg font-semibold mb-2">Installment</h6>

        <!-- Table (MD+) -->
        <div class="overflow-x-auto hidden md:block">
          <table class="min-w-full border border-gray-300 text-left">
            <thead class="bg-gray-100 border-b border-gray-300">
              <tr>
                <th scope="col" class="px-4 py-2">Period</th>
                <th scope="col" class="px-4 py-2">Status</th>
                <th scope="col" class="px-4 py-2">Payment</th>
                <th scope="col" class="px-4 py-2 text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(installment, index) in installmentDetails" :key="index"
                class="border-b border-gray-200 hover:bg-gray-50">
                <td class="px-4 py-2">{{ installment.period }}</td>
                <td class="px-4 py-2">
                  {{ installment.paid ? "Paid" : "Not Paid" }}
                </td>
                <td class="px-4 py-2">{{ installment.amount }}</td>
                <td class="px-4 py-2 text-right">{{ installment.balance }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="px-4 py-2 font-semibold">Balance:</td>
                <td class="px-4 py-2 text-right font-semibold">
                  {{ balance }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Stacked layout (SM) -->
        <div class="block md:hidden space-y-2">
          <div v-for="(installment, index) in installmentDetails" :key="index"
            class="border border-gray-300 rounded p-2 bg-white shadow-sm">
            <div>
              <span class="font-semibold">Period: </span>{{ installment.period }}
            </div>
            <div>
              <span class="font-semibold">Status: </span>
              {{ installment.paid ? "Paid" : "Not Paid" }}
            </div>
            <div>
              <span class="font-semibold">Payment: </span>{{ installment.amount }}
            </div>
            <div>
              <span class="font-semibold">Balance: </span>{{ installment.balance }}
            </div>
          </div>
          <!-- Overall Balance -->
          <div class="font-semibold flex justify-between">
            <span>Balance:</span>
            <span>{{ balance }}</span>
          </div>
        </div>
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
  computed: {
    // Sum of all payments
    net() {
      return (
        Math.round(
          this.payments.reduce((acc, item) => acc + parseFloat(item.cash), 0) *
          100
        ) / 100
      );
    },
    // Sum of all fees minus payments
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
    // Sum of schedule units
    totalUnits() {
      return this.schedules.reduce(
        (acc, item) => acc + parseFloat(item.units),
        0
      );
    },
    // Installment breakdown
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
        runningBalance -= amount;
        details.push({
          amount,
          paid,
          period: `${i + 1}${["st", "nd", "rd"][((i + 1) % 10) - 1] || "th"}`,
          balance:
            runningBalance <= 0 ? 0 : Math.round(runningBalance * 100) / 100,
        });
      }
      return details;
    },
  },
  async created() {
    await this.loadData();
    this.populateSemesters();
  },
  methods: {
    async loadData() {
      const currentYear = new Date().getFullYear();
      const authStore = useAuthStore();
      const configStore = useConfigStore();
      const financeStore = useFinanceStore();
      const userCategory = authStore.user.category.toLowerCase();

      this.type =
        userCategory === "college" || userCategory === "techvoch"
          ? "college"
          : "shs_jhs";

      try {
        // If already stored and not switching semester, use store data
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
          // Otherwise fetch from API
          if (!this.activateSelect) {
            const config = await viewSYSEM();
            this.sy = config[0].sy;
            this.sem = config[0].sem;
          }

          const courseDetails = {
            crs: authStore.user.coursecode,
            mjr: authStore.user.major,
            lvl: authStore.user.yrlevel,
            sy: this.sy,
            sem: this.sem,
          };

          const studentDetails = {
            studentno: authStore.user.studentno,
            sy: this.sy,
            semester: this.sem,
          };

          this.installment = parseFloat((await countExams(this.type)).n);
          this.assessment = await viewAssessment(courseDetails);
          this.schedules = await viewSchedule(studentDetails);
          this.payments = await viewPayments({
            transid:
              authStore.user.studentno +
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

      // If we haven't switched semester, set default semester label
      if (!this.activateSelect) {
        this.semester =
          userCategory === "college" || userCategory === "techvoch"
            ? `${this.sem} ${currentYear}-${currentYear + 1}`
            : `${currentYear}-${currentYear + 1}`;
      }
    },
    // Populate the semester dropdown
    populateSemesters() {
      const currentYear = new Date().getFullYear();
      const startYear = currentYear - 10;
      const semesters = [];

      for (let year = currentYear + 1; year >= startYear; year--) {
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
      this.loading = true;
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
  },
};
</script>

<style scoped>
tfoot {
  font-weight: bold;
}
</style>
