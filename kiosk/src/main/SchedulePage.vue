<template>
  <div class="relative mb-4">
    <!-- Spinner overlay if loading -->
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50"
    >
      <div
        class="w-16 h-16 border-8 border-gray-200 border-t-blue-500 rounded-full animate-spin"
      ></div>
    </div>

    <!-- Select Semester/Period -->
    <div class="p-2">
      <form class="flex items-center space-x-2">
        <label for="semester" class="sr-only">Select Semester/Period</label>
        <select
          id="semester"
          class="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          v-model="semester"
          @change="handleSemesterChange"
        >
          <option value="">Select Semester/Period</option>
          <option
            v-for="semesterItem in semesters"
            :value="semesterItem"
            :key="semesterItem"
          >
            {{ semesterItem }}
          </option>
        </select>
      </form>
    </div>
  </div>

  <!-- TABLE for md+ screens -->
  <div class="overflow-x-auto hidden md:block">
    <table class="min-w-full text-left border border-gray-300">
      <thead class="bg-gray-100 border-b border-gray-300">
        <tr>
          <th scope="col" class="px-4 py-2">Subject</th>
          <th scope="col" class="px-4 py-2">Description</th>
          <th scope="col" class="px-4 py-2">Term</th>
          <th scope="col" class="px-4 py-2">Block</th>
          <th scope="col" class="px-4 py-2">Time</th>
          <th scope="col" class="px-4 py-2">Day</th>
          <th scope="col" class="px-4 py-2">Room</th>
          <th scope="col" class="px-4 py-2">Units</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in schedules"
          :key="index"
          class="border-b border-gray-200 hover:bg-gray-50"
        >
          <td class="px-4 py-2">{{ item.subjectcode }}</td>
          <td class="px-4 py-2">{{ item.subjectdesc }}</td>
          <td class="px-4 py-2">{{ item.term }}</td>
          <td class="px-4 py-2">{{ item.section }}</td>
          <td class="px-4 py-2">{{ item.time }}</td>
          <td class="px-4 py-2">{{ item.day }}</td>
          <td class="px-4 py-2">{{ item.room_no }}</td>
          <td class="px-4 py-2">{{ item.units }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- STACKED layout for small screens -->
  <div class="block md:hidden space-y-3 px-2">
    <div
      v-for="(item, index) in schedules"
      :key="index"
      class="border border-gray-300 rounded p-3 bg-white shadow-sm"
    >
      <!-- Each field is in its own row -->
      <div class="mb-2">
        <span class="font-semibold">Subject: </span>{{ item.subjectcode }}
      </div>
      <div class="mb-2">
        <span class="font-semibold">Description: </span>{{ item.subjectdesc }}
      </div>
      <div class="mb-2">
        <span class="font-semibold">Term: </span>{{ item.term }}
      </div>
      <div class="mb-2">
        <span class="font-semibold">Block: </span>{{ item.section }}
      </div>
      <div class="mb-2">
        <span class="font-semibold">Time: </span>{{ item.time }}
      </div>
      <div class="mb-2">
        <span class="font-semibold">Day: </span>{{ item.day }}
      </div>
      <div class="mb-2">
        <span class="font-semibold">Room: </span>{{ item.room_no }}
      </div>
      <div><span class="font-semibold">Units: </span>{{ item.units }}</div>
    </div>
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
      this.studentno = authStore.user.studentno;
      const userCategory = authStore.user.category.toLowerCase();

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
          // e.g. "1st Semester 2023-2024"
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
  },
};
</script>

<style scoped>
/* Optional: small shadow or background for each row’s “card” on mobile */
</style>
