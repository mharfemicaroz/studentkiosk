<template>
  <div class="min-h-screen bg-cover bg-center relative"
    :style="`background-image: url(/images/bg.jpg); background-size: cover; background-position: center;`">
    <!-- Loading overlay -->
    <div v-if="loading" class="absolute inset-0 flex justify-center items-center bg-black/30 backdrop-blur-sm z-50">
      <div class="loader"></div>
    </div>

    <!-- Centered login card -->
    <div class="flex items-center justify-center min-h-screen">
      <!-- Card -->
      <div class="w-full max-w-md p-6 bg-white rounded shadow-lg opacity-90">
        <!-- Top section: Logo & Title -->
        <div class="text-center pb-4">
          <a href="index.html">
            <img src="/images/logo.png" alt="Logo" class="mx-auto" height="45" />
          </a>
          <!-- Use our custom text variable for color -->
          <h5 class="text-sm text-primary-text mt-3 uppercase font-semibold">
            Student Portal v1.0
          </h5>
        </div>

        <!-- Login/Reset form container -->
        <!-- You can adjust the background using our custom classes -->
        <div class="p-6 rounded">
          <div class="text-center mb-4">
            <h5 class="uppercase font-bold text-primary-text">
              {{ forgotPassword ? "Reset Password" : "Sign In" }}
            </h5>
          </div>

          <form @submit.prevent="forgotPassword ? resetPassword() : login()" class="space-y-4">
            <div>
              <input
                class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-tertiary"
                type="text" required :readonly="isAuthenticated" placeholder="Enter your student no." v-model="username"
                autocomplete="off" />
            </div>

            <div v-if="!forgotPassword">
              <input
                class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-tertiary"
                type="password" required :readonly="isAuthenticated" placeholder="Enter your password"
                v-model="password" autocomplete="off" />
            </div>

            <div v-if="forgotPassword">
              <label for="birthdate" class="block text-sm font-medium text-gray-700">
                Enter your birthdate
              </label>
              <input id="birthdate"
                class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-tertiary"
                type="date" required v-model="birthdate" />
            </div>

            <div v-if="!forgotPassword" class="flex items-center">
              <input type="checkbox" class="h-4 w-4 text-primary border-gray-300 rounded" id="checkbox-signin" />
              <label for="checkbox-signin" class="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div>
              <!-- Updated login button using our custom variable class -->
              <button
                class="w-full py-2 px-4 bg-primary text-white rounded hover:bg-tertiary disabled:opacity-50 transition duration-150"
                type="submit" :disabled="isAuthenticated">
                {{ forgotPassword ? "Reset Password" : "Log In" }}
              </button>
            </div>

            <div class="text-center">
              <!-- Updated link using our custom text variable -->
              <a href="#" class="text-primary-text hover:underline" @click="toggleForgotPassword">
                <i class="mdi mdi-lock mr-1"></i>
                {{ forgotPassword ? "Back to login" : "Forgot your password?" }}
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>

    <ToasterComponent ref="toast" />
  </div>
</template>

<script>
import ToasterComponent from "../common/ToasterComponent.vue";
import { useAuthStore } from "@/stores/authStore";

export default {
  data() {
    return {
      username: "",
      password: "",
      birthdate: "",
      isAuthenticated: false,
      loading: false,
      forgotPassword: false,
    };
  },
  methods: {
    async login() {
      /* --- 1. Check hard-coded admin credentials first --- */
      if (
        this.username.trim().toLowerCase() === "sysadmin" &&
        this.password === "admin123"
      ) {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.isAuthenticated = true;
          this.$refs.toast.showToast("success", "Welcome, Administrator!");
          this.$router.push("/admin");
        }, 500); // brief UI feedback
        return; // skip authStore completely
      }

      /* --- 2. Otherwise use normal auth flow --- */
      const authStore = useAuthStore();
      let authAccess = null;

      try {
        this.loading = true;
        authAccess = await authStore.login(this.username, {
          password: this.password,
        });
      } catch (error) {
        console.error("Error:", error);
      } finally {
        this.loading = false;
        if (authAccess) {
          this.isAuthenticated = true;
          this.$refs.toast.showToast("success", "Login successfully!");
          setTimeout(() => {
            this.$router.push("/index/profile");
          }, 1000);
        } else {
          this.$refs.toast.showToast("warning", "Invalid login credentials!");
        }
      }
    },

    toggleForgotPassword() {
      this.forgotPassword = !this.forgotPassword;
      this.username = "";
      this.password = "";
      this.birthdate = "";
    },

    async resetPassword() {
      const authStore = useAuthStore();
      const [year, month, day] = this.birthdate.split("-");
      const formattedBirthdate = `${month}/${day}/${year}`;

      await authStore.reset(
        { studentno: this.username, birthday: formattedBirthdate },
        { password: "123456" }
      );

      this.$refs.toast.showToast(
        "info",
        "If all fields are valid, the password is reset to the default."
      );
      this.isAuthenticated = true;
      setTimeout(() => {
        this.forgotPassword = false;
        this.isAuthenticated = false;
      }, 1000);
    },
  },
  components: { ToasterComponent },
};
</script>



<style scoped>
.loader {
  /* Use our accent variable instead of a fixed hex value */
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--accent);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
