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
import { useConfigStore } from "@/stores/configStore";
import { useScheduleStore } from "@/stores/scheduleStore";
import { viewSchedule } from "@/services/scheduleServices";
import { viewSYSEM } from "@/services/configServices";

export default {
  data() {
    return {
      sy: "",
      sem: "",
      type: "",
      semester: "",
      studentno: null,
      schedules: [],
      semesters: [],
      loading: true,
      activateSelect: false,
    };
  },
  async created() {
    await this.loadData();
    this.populateSemesters();
  },
  methods: {
    async loadData() {
      const currentYear = new Date().getFullYear();
      const authStore = useAuthStore();
      const scheduleStore = useScheduleStore();
      const configStore = useConfigStore();
      this.studentno = authStore.user[0].studentno;
      const userCategory = authStore.user[0].category.toLowerCase();

      this.type =
        userCategory === "college" || userCategory === "techvoch"
          ? "college"
          : "shs_jhs";

      try {
        if (
          scheduleStore.schedules &&
          configStore.configs &&
          !this.activateSelect
        ) {
          this.schedules = scheduleStore.schedules;
          const config = configStore.configs;
          this.sy = config[0].sy;
          this.sem = config[0].sem;
        } else {
          if (!this.activateSelect) {
            const config = await viewSYSEM();
            this.sy = config[0].sy;
            this.sem = config[0].sem;
          }

          this.schedules = await viewSchedule({
            studentno: this.studentno,
            sy: this.sy,
            semester: this.sem,
          });

          scheduleStore.setSchedules(this.schedules);
          configStore.setConfig([{ sy: this.sy, sem: this.sem }]);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        this.loading = false;
      }

      if (!this.activateSelect) {
        this.semester =
          userCategory === "college" || userCategory === "techvoch"
            ? `${this.sem} ${currentYear - 1}-${currentYear}`
            : `${currentYear - 1}-${currentYear}`;
      }
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
    loadScript(scriptName, scriptSource) {
      const scriptId = `script-${scriptName}`;
      if (document.getElementById(scriptId)) {
        console.log("Script already loaded:", scriptName);
        return;
      }
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = scriptSource;
      document.head.appendChild(script);
    },
  },
  mounted() {
    const scripts = [
      { name: "script1", src: "/js/vendor.min.js" },
      { name: "script2", src: "/libs/morris-js/morris.min.js" },
      { name: "script3", src: "/libs/morris-js/morris.min.js" },
      { name: "script4", src: "/libs/raphael/raphael.min.js" },
      { name: "script5", src: "/js/pages/dashboard.init.js" },
      { name: "script6", src: "/js/app.min.js" },
    ];
    scripts.forEach((script) => this.loadScript(script.name, script.src));
  },
};
</script>
