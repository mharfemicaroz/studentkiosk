<template>
  <!-- Container for the entire evaluation data -->
  <div class="relative">
    <!-- Spinner overlay if loading -->
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50"
    >
      <div
        class="w-16 h-16 border-8 border-gray-200 border-t-blue-500 rounded-full animate-spin"
      ></div>
    </div>

    <!-- v-for for each grouped level-semester -->
    <div
      v-for="(group, key) in groupedEvaluation"
      :key="key"
      class="mb-6 px-2 sm:px-0"
    >
      <h6 class="text-lg font-semibold mb-3">
        {{ key }}
      </h6>

      <!-- TABLE for md+ screens -->
      <div class="overflow-x-auto hidden md:block">
        <table class="min-w-full text-left border border-gray-300">
          <thead class="bg-gray-100 border-b border-gray-300">
            <tr>
              <th scope="col" class="px-4 py-2 w-1/5">Course Code</th>
              <th scope="col" class="px-4 py-2 w-1/2">Descriptive Title</th>
              <th scope="col" class="px-4 py-2 w-1/6">Credits</th>
              <th scope="col" class="px-4 py-2 w-1/6">Final</th>
              <th scope="col" class="px-4 py-2 w-1/6">Re-exam</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in group"
              :key="item.sub_code"
              class="border-b border-gray-200 hover:bg-gray-50"
            >
              <td class="px-4 py-2">{{ item.sub_code }}</td>
              <td class="px-4 py-2">{{ item.subject_title }}</td>
              <td class="px-4 py-2">{{ item.sub_units }}</td>
              <td class="px-4 py-2">{{ item.grade }}</td>
              <td class="px-4 py-2">{{ item.reexam }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- STACKED layout for small screens -->
      <div class="block md:hidden space-y-3">
        <div
          v-for="item in group"
          :key="item.sub_code"
          class="border border-gray-300 rounded p-3 bg-white shadow-sm hover:bg-gray-50"
        >
          <!-- Each field is in its own row with a label -->
          <div class="mb-1">
            <span class="font-semibold">Course Code: </span>
            {{ item.sub_code }}
          </div>
          <div class="mb-1">
            <span class="font-semibold">Descriptive Title: </span>
            {{ item.subject_title }}
          </div>
          <div class="mb-1">
            <span class="font-semibold">Credits: </span>
            {{ item.sub_units }}
          </div>
          <div class="mb-1">
            <span class="font-semibold">Final: </span>
            {{ item.grade }}
          </div>
          <div>
            <span class="font-semibold">Re-exam: </span>
            {{ item.reexam }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";
import { useEvaluationStore } from "@/stores/evaluationStore";
import { viewEvaluation } from "@/services/evaluationServices";

export default {
  data() {
    return {
      studentno: null,
      evaluation: [],
      loading: true,
    };
  },
  async created() {
    this.loadData();
  },
  computed: {
    // Group items by "Level X - Semester"
    groupedEvaluation() {
      const groups = {};
      this.evaluation.forEach((item) => {
        const groupKey = `Level ${item.yrlevel} - ${item.semester}`;
        if (!groups[groupKey]) {
          groups[groupKey] = [];
        }
        groups[groupKey].push(item);
      });
      return groups;
    },
  },
  methods: {
    async loadData() {
      const authStore = useAuthStore();
      const evaluationStore = useEvaluationStore();
      this.studentno = authStore.user.studentno;
      try {
        // If already in store, just use it; otherwise fetch
        if (evaluationStore.evaluations) {
          this.evaluation = evaluationStore.evaluations;
        } else {
          this.evaluation = await viewEvaluation({ studentno: this.studentno });
          evaluationStore.setEvaluation(this.evaluation);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* No additional styles needed if you rely on Tailwind classes. */
</style>
