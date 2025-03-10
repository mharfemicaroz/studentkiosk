<template>
  <div id="wrapper" class="min-h-screen flex flex-col">
    <!-- Spinner Overlay -->
    <div
      v-if="loading"
      class="fixed inset-0 bg-white bg-opacity-80 flex justify-center items-center z-50"
    >
      <div
        class="border-8 border-gray-200 border-t-accent rounded-full w-24 h-24 animate-spin"
      ></div>
    </div>

    <!-- Combined Sticky Header -->
    <header class="sticky top-0 z-10">
      <!-- Top Header -->
      <div class="flex justify-between items-center bg-primary p-4">
        <div class="flex items-center space-x-4">
          <!-- Toggle for mobile nav -->
          <button class="md:hidden focus:outline-none" @click="toggleSidebar">
            <i class="mdi mdi-menu text-white text-2xl"></i>
          </button>
          <div class="logo-box">
            <a href="javascript:void(0)" class="flex items-center">
              <img
                src="/images/logo-banner.png"
                alt="Logo"
                class="hidden md:block"
                width="158"
                height="50"
              />
              <img
                src="/images/logo-sm.png"
                alt="Logo"
                class="block md:hidden"
                height="45"
              />
            </a>
          </div>
        </div>
        <nav class="flex items-center space-x-4">
          <span class="text-yellow-300 font-semibold">{{ fullname }}</span>
          <a
            href="#"
            @click="logout"
            class="flex items-center text-yellow-300 hover:underline"
          >
            <i class="mdi mdi-logout mr-1 text-3xl md:text-2xl"></i>
            <span class="hidden md:inline">Log Out</span>
          </a>
        </nav>
      </div>
      <!-- Mobile Top Navigation (visible only on small screens) -->
      <nav
        v-if="showSidebar"
        class="bg-secondary text-white md:hidden overflow-x-auto"
      >
        <ul class="flex space-x-4 p-2 whitespace-nowrap">
          <li>
            <router-link
              to="/index/profile"
              active-class="bg-tertiary"
              class="flex items-center p-2 hover:bg-tertiary rounded"
            >
              <i class="mdi mdi-account mr-2 text-yellow-300"></i>
              <span class="text-sm">Personal Record</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/index/schedule"
              active-class="bg-tertiary"
              class="flex items-center p-2 hover:bg-tertiary rounded"
            >
              <i class="mdi mdi-clock-outline mr-2 text-yellow-300"></i>
              <span class="text-sm">Class Schedule</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/index/evaluation"
              active-class="bg-tertiary"
              class="flex items-center p-2 hover:bg-tertiary rounded"
            >
              <i class="mdi mdi-school mr-2 text-yellow-300"></i>
              <span class="text-sm">Academic Record</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/index/finance"
              active-class="bg-tertiary"
              class="flex items-center p-2 hover:bg-tertiary rounded"
            >
              <i class="mdi mdi-finance mr-2 text-yellow-300"></i>
              <span class="text-sm">Financial Record</span>
            </router-link>
          </li>
          <li>
            <a
              href="javascript:void(0)"
              @click="openSettingsModal"
              class="flex items-center p-2 hover:bg-tertiary rounded"
            >
              <i class="mdi mdi-cog mr-2 text-yellow-300"></i>
              <span class="text-sm">Settings</span>
            </a>
          </li>
        </ul>
      </nav>
    </header>

    <div class="flex flex-1">
      <!-- Sidebar for Desktop (visible on medium and larger screens) -->
      <aside class="w-64 bg-secondary text-white p-4 hidden md:block">
        <nav>
          <h2 class="text-lg font-bold mb-4 text-yellow-300">Navigation</h2>
          <ul>
            <li class="mb-2">
              <router-link
                to="/index/profile"
                active-class="bg-tertiary"
                class="flex items-center p-2 hover:bg-tertiary rounded"
              >
                <i class="mdi mdi-account mr-2 text-yellow-300"></i>
                <span>Personal Record</span>
              </router-link>
            </li>
            <li class="mb-2">
              <router-link
                to="/index/schedule"
                active-class="bg-tertiary"
                class="flex items-center p-2 hover:bg-tertiary rounded"
              >
                <i class="mdi mdi-clock-outline mr-2 text-yellow-300"></i>
                <span>Class Schedule</span>
              </router-link>
            </li>
            <li class="mb-2">
              <router-link
                to="/index/evaluation"
                active-class="bg-tertiary"
                class="flex items-center p-2 hover:bg-tertiary rounded"
              >
                <i class="mdi mdi-school mr-2 text-yellow-300"></i>
                <span>Academic Record</span>
              </router-link>
            </li>
            <li class="mb-2">
              <router-link
                to="/index/finance"
                active-class="bg-tertiary"
                class="flex items-center p-2 hover:bg-tertiary rounded"
              >
                <i class="mdi mdi-finance mr-2 text-yellow-300"></i>
                <span>Financial Record</span>
              </router-link>
            </li>
            <li class="mb-2">
              <a
                href="javascript:void(0)"
                @click="openSettingsModal"
                class="flex items-center p-2 hover:bg-tertiary rounded"
              >
                <i class="mdi mdi-cog mr-2 text-yellow-300"></i>
                <span>Settings</span>
              </a>
            </li>
            <li class="mb-2">
              <a
                href="#"
                @click="logout"
                class="flex items-center p-2 hover:bg-tertiary rounded"
                ref="logoutButton"
              >
                <i class="mdi mdi-logout mr-2 text-yellow-300"></i>
                <span>Log Out</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6 bg-white">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-primary-text">
            {{ $route.name }}
          </h1>
        </div>
        <div class="bg-white shadow rounded p-4">
          <router-view />
        </div>
      </main>
    </div>

    <!-- Footer -->
    <footer class="bg-primary p-4 text-center text-white">
      <p class="text-sm">
        2024 &copy; Student Kiosk by
        <a
          href="https://www.facebook.com/mharfemicaroz"
          target="_blank"
          class="text-yellow-300 hover:underline"
        >
          Mharfe M. Micaroz
        </a>
      </p>
    </footer>

    <!-- Settings Modal -->
    <div
      v-if="showSettingsModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
    >
      <div
        class="bg-white rounded-lg overflow-hidden shadow-lg w-full max-w-md"
      >
        <div class="px-4 py-2 border-b flex justify-between items-center">
          <h5 class="text-lg font-bold text-primary-text">Change Password</h5>
          <button
            type="button"
            class="text-gray-600 hover:text-gray-800"
            @click="closeSettingsModal"
          >
            &times;
          </button>
        </div>
        <div class="p-4">
          <div class="space-y-4">
            <!-- Current Password -->
            <div>
              <label
                for="current-password"
                class="block text-sm font-medium text-gray-700"
              >
                Current Password
              </label>
              <input
                type="password"
                autocomplete="off"
                class="mt-1 block w-full border border-gray-300 rounded p-2"
                id="current-password"
                v-model="oldpass"
                placeholder="Enter current password"
                @input="validateOldPassword"
              />
              <div v-if="oldpassError" class="text-red-600 text-sm mt-1">
                {{ oldpassError }}
              </div>
            </div>

            <!-- New Password -->
            <div>
              <label
                for="new-password"
                class="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                maxlength="6"
                autocomplete="off"
                class="mt-1 block w-full border border-gray-300 rounded p-2"
                id="new-password"
                v-model="newpass"
                placeholder="Enter new password"
                @input="validateNewPassword"
              />
              <div v-if="newpassError" class="text-red-600 text-sm mt-1">
                {{ newpassError }}
              </div>
            </div>

            <!-- Confirm New Password -->
            <div>
              <label
                for="confirm-password"
                class="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                autocomplete="off"
                maxlength="6"
                class="mt-1 block w-full border border-gray-300 rounded p-2"
                id="confirm-password"
                v-model="conpass"
                placeholder="Confirm new password"
                @input="validateConfirmPassword"
              />
              <div v-if="conpassError" class="text-red-600 text-sm mt-1">
                {{ conpassError }}
              </div>
            </div>
          </div>
        </div>
        <div class="px-4 py-2 border-t flex justify-end space-x-2">
          <button
            ref="closeButton"
            type="button"
            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            @click="closeSettingsModal"
          >
            Close
          </button>
          <button
            type="button"
            class="px-4 py-2 bg-primary text-white rounded hover:bg-tertiary"
            @click="saveChanges"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>

    <ToasterComponent ref="toast" />
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";
import { useConfigStore } from "@/stores/configStore";
import { useFinanceStore } from "@/stores/financeStore";
import { useScheduleStore } from "@/stores/scheduleStore";
import { useEvaluationStore } from "@/stores/evaluationStore";
import { updateStudentById } from "@/services/profileServices";
import ToasterComponent from "../common/ToasterComponent.vue";

export default {
  components: { ToasterComponent },
  data() {
    return {
      title: "",
      fullname: "",
      role: "",
      oldpass: "",
      newpass: "",
      conpass: "",
      oldpassError: "",
      newpassError: "",
      conpassError: "",
      currentPassword: "",
      user: {},
      isChanged: false,
      // For mobile, the top navigation is toggled on by default.
      showSidebar: true,
      showSettingsModal: false,
      loading: false,
    };
  },
  methods: {
    async logout() {
      const authStore = useAuthStore();
      const configStore = useConfigStore();
      const financeStore = useFinanceStore();
      const scheduleStore = useScheduleStore();
      const evaluationStore = useEvaluationStore();
      const token = authStore.user.token;
      try {
        this.loading = true;
        configStore.clearConfig();
        evaluationStore.clearEvaluation();
        scheduleStore.clearSchedules();
        financeStore.clearInstallment();
        financeStore.clearAssessment();
        financeStore.clearSchedule();
        financeStore.clearPayment();
        await authStore.logout(token).then(() => {
          this.$router.push(`/`);
        });
      } catch (error) {
        console.error("Error:", error);
      } finally {
        this.loading = false;
      }
    },
    validateOldPassword() {
      if (this.oldpass !== this.currentPassword) {
        this.oldpassError = "Current password is incorrect";
      } else {
        this.oldpassError = "";
      }
    },
    validateNewPassword() {
      const digitRegex = /^\d+$/;
      if (this.newpass.length < 6) {
        this.newpassError = "New password must be at least 6 characters long";
      } else if (!digitRegex.test(this.newpass)) {
        this.newpassError = "New password must contain only numbers (0-9)";
      } else {
        this.newpassError = "";
      }
    },
    validateConfirmPassword() {
      if (this.conpass !== this.newpass) {
        this.conpassError = "Passwords do not match";
      } else {
        this.conpassError = "";
      }
    },
    async saveChanges() {
      if (!this.isChanged) {
        this.validateOldPassword();
        this.validateNewPassword();
        this.validateConfirmPassword();
        if (!this.oldpassError && !this.newpassError && !this.conpassError) {
          await updateStudentById(this.user.id, { password: this.newpass });
          this.newpass = "";
          this.oldpass = "";
          this.conpass = "";
          this.isChanged = true;
          this.closeSettingsModal();
          this.$refs.toast.showToast(
            "success",
            "Your password is updated successfully!"
          );
          setTimeout(() => {
            this.$refs.logoutButton.click();
          }, 2500);
        }
      }
    },
    openSettingsModal() {
      this.showSettingsModal = true;
    },
    closeSettingsModal() {
      this.showSettingsModal = false;
    },
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
    },
    loadScript(scriptName, scriptSource) {
      const scriptId = `script-${scriptName}`;
      if (document.getElementById(scriptId)) return;
      let script = document.createElement("script");
      script.id = scriptId;
      script.src = scriptSource;
      document.body.appendChild(script);
    },
  },
  mounted() {
    const authStore = useAuthStore();
    this.title = document.title;
    this.user = authStore.user[0];
    this.fullname = authStore.user.firstname + " " + authStore.user.surname;
    this.currentPassword = authStore.user.password;
  },
};
</script>

<style scoped>
/* Additional component-specific styles can be added here */
</style>
