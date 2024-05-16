<template>
  <div class="row mb-3">
    <div class="col-6">
      <div class="container">
        <form class="form-inline">
          <div class="form-group">
            <label for="semester" class="sr-only">Select Semester/Period</label>
            <select id="semester" class="form-control mr-2">
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

  <div class="table-responsive">
    <table class="table mb-0">
      <thead>
        <tr>
          <th scope="col">Subject</th>
          <th scope="col">Description</th>
          <th scope="col">Term</th>
          <th scope="col">Block</th>
          <th scope="col">Time</th>
          <th scope="col">Day</th>
          <th scope="col">Room</th>
          <th scope="col">Units</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in schedules" :key="index">
          <td>{{ item.subjectcode }}</td>
          <td>{{ item.subjectdesc }}</td>
          <td>{{ item.term }}</td>
          <td>{{ item.section }}</td>
          <td>{{ item.time }}</td>
          <td>{{ item.day }}</td>
          <td>{{ item.room_no }}</td>
          <td>{{ item.units }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { useAuthStore } from "@/stores/authStore";
import { viewSchedule } from "@/services/scheduleServices";
import { viewSYSEM } from "@/services/configServices";
export default {
  data() {
    return {
      sy: "",
      sem: "",
      studentno: null,
      schedules: [],
      semesters: [],
    };
  },
  async created() {
    this.loadData();
    this.populateSemesters();
  },
  methods: {
    async loadData() {
      const authStore = useAuthStore();
      this.studentno = authStore.user[0].studentno;
      let type = "";

      const config = await viewSYSEM();
      this.sy = config[0].sy;
      this.sem = config[0].sem;
      if (authStore.user[0].category.toLowerCase() === "college") {
        type = "college";
      } else {
        type = "shs_jhs";
        this.sem = "SY";
      }
      this.schedules = await viewSchedule({
        studentno: this.studentno,
        sy: this.sy,
        semester: this.sem,
      });
    },
    populateSemesters() {
      const currentYear = new Date().getFullYear();
      const startYear = currentYear - 10;
      const semesters = [];

      for (let year = currentYear; year >= startYear; year--) {
        semesters.push(`Summer ${year}`);
        semesters.push(`2nd Semester ${year}-${year}`);
        semesters.push(`1st Semester ${year}-${year}`);
      }

      this.semesters = semesters;
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
