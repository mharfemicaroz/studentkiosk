<template>
  <div class="table-responsive">
    <div v-if="loading" class="spinner-overlay">
      <div class="spinner"></div>
    </div>
    <div v-for="(group, key) in groupedEvaluation" :key="key">
      <h6>{{ key }}</h6>
      <table class="table">
        <thead>
          <tr>
            <th scope="col" style="width: 20%">Course Code</th>
            <th scope="col" style="width: 50%">Descriptive Title</th>
            <th scope="col" style="width: 10%">Credits</th>
            <th scope="col" style="width: 10%">Final</th>
            <th scope="col" style="width: 10%">Re-exam</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in group" :key="item.sub_code">
            <td>{{ item.sub_code }}</td>
            <td>{{ item.subject_title }}</td>
            <td>{{ item.sub_units }}</td>
            <td>{{ item.grade }}</td>
            <td>{{ item.reexam }}</td>
          </tr>
        </tbody>
      </table>
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
      this.studentno = authStore.user[0].studentno;

      try {
        if (evaluationStore.evaluations) {
          this.evaluation = evaluationStore.evaluations;
        } else {
          this.evaluation = await viewEvaluation({
            studentno: this.studentno,
          });
          evaluationStore.setEvaluation(this.evaluation);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        this.loading = false;
      }
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
