<template>
  <div
    class="container-fluid login-background"
    :style="`background-image:${currentBackground}`"
  >
    <div v-if="loading" class="spinner-overlay">
      <div class="spinner"></div>
    </div>
    <div class="authentication-page">
      <div class="account-pages my-5 pt-md-5">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6 col-xl-5">
              <div class="text-center pb-1">
                <a href="index.html">
                  <span><img src="/images/logo.png" alt="" height="45" /></span>
                </a>
                <h5 class="font-14 text-muted mt-3">
                  Student & Parent Portal V1.0
                </h5>
              </div>
              <div class="card mt-4">
                <div class="card-body p-4">
                  <div class="text-center mb-4">
                    <h5 class="text-uppercase">
                      {{ forgotPassword ? "Reset Password" : "Sign In" }}
                    </h5>
                  </div>

                  <form
                    @submit.prevent="forgotPassword ? resetPassword() : login()"
                    class="p-2"
                  >
                    <div class="form-group mb-3">
                      <input
                        class="form-control"
                        type="text"
                        required
                        :readonly="isAuthenticated"
                        placeholder="Enter your student no."
                        v-model="username"
                        autocomplete="off"
                      />
                    </div>

                    <div class="form-group mb-3" v-if="!forgotPassword">
                      <input
                        class="form-control"
                        type="password"
                        required
                        :readonly="isAuthenticated"
                        placeholder="Enter your password"
                        v-model="password"
                        autocomplete="off"
                      />
                    </div>

                    <div class="form-group mb-3" v-if="forgotPassword">
                      <label for="birthdate">Enter your birthdate</label>
                      <input
                        id="birthdate"
                        class="form-control"
                        type="date"
                        required
                        v-model="birthdate"
                      />
                    </div>

                    <div class="form-group mb-3">
                      <div class="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          class="custom-control-input"
                          id="checkbox-signin"
                        />
                        <label
                          class="custom-control-label"
                          for="checkbox-signin"
                          >Remember me</label
                        >
                      </div>
                    </div>

                    <div class="form-group mb-4">
                      <button
                        class="btn btn-primary btn-bordered-primary btn-block waves-effect waves-light"
                        type="submit"
                        :disabled="isAuthenticated"
                      >
                        {{ forgotPassword ? "Reset Password" : "Log In" }}
                      </button>
                    </div>

                    <a href="#" class="text-muted" @click="toggleForgotPassword"
                      ><i class="mdi mdi-lock mr-1"></i>
                      {{
                        forgotPassword
                          ? "Back to login"
                          : "Forgot your password?"
                      }}</a
                    >
                  </form>
                </div>
                <!-- end card-body -->
              </div>
              <!-- end card -->

              <!-- end row -->
            </div>
            <!-- end col -->
          </div>
          <!-- end row -->
        </div>
        <!-- end container -->
      </div>
    </div>
  </div>
  <ToasterComponent ref="toast" />
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
      currentBackground: "",
      isAuthenticated: false,
      loading: false,
      forgotPassword: false,
    };
  },
  methods: {
    async login() {
      const authStore = useAuthStore(); // Access the authStore
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

          let path = `/index/profile`;
          setTimeout(() => {
            this.$router.push(path);
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
        {
          password: "123456",
        }
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
.login-background {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  transition: background-image 1s ease-out;
}

.login-background::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: inherit;
  filter: blur(1px);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
}

.container-fluid.login-background {
  background-image: url(/images/bg.jpg);
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
  background-size: cover;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
}
</style>
