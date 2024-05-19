<template>
  <div id="wrapper">
    <div class="navbar-custom">
      <ul class="list-unstyled topnav-menu float-right mb-0">
        <li class="dropdown notification-list">
          <a class="nav-link mr-0 waves-effect waves-light text-light" href="#">
            {{ fullname }}
          </a>
        </li>
        <li class="dropdown notification-list">
          <a
            href="#"
            @click="logout"
            class="nav-link mr-0 waves-effect waves-light text-light"
          >
            <i class="mdi mdi-logout"></i>
            <span>Log Out</span>
          </a>
        </li>
      </ul>
      <!-- LOGO -->
      <div class="logo-box">
        <a href="index.html" class="logo text-center">
          <span class="logo-lg">
            <img src="/images/logo-light.png" alt="" height="45" />
            <!-- <span class="logo-lg-text-light">Flacto</span> -->
          </span>
          <span class="logo-sm">
            <!-- <span class="logo-sm-text-dark">F</span> -->
            <img src="/images/logo-sm.png" alt="" height="45" />
          </span>
        </a>
      </div>

      <ul class="list-unstyled topnav-menu topnav-menu-left m-0">
        <li>
          <button class="button-menu-mobile waves-effect waves-light">
            <i class="mdi mdi-menu"></i>
          </button>
        </li>
      </ul>
    </div>

    <div class="left-side-menu">
      <div class="slimscroll-menu">
        <!--- Sidemenu -->
        <div id="sidebar-menu">
          <ul class="metismenu" id="side-menu">
            <li class="menu-title">Navigation</li>

            <li>
              <router-link to="/index/profile">
                <i class="mdi mdi-account"></i>
                <span>Personal Record</span>
              </router-link>
            </li>

            <li>
              <router-link to="/index/schedule">
                <i class="mdi mdi-clock-outline"></i>
                <span>Class Schedule</span>
              </router-link>
            </li>

            <li>
              <router-link to="/index/evaluation">
                <i class="mdi mdi-school"></i>
                <span>Academic Record</span>
              </router-link>
            </li>

            <li>
              <router-link to="/index/finance">
                <i class="mdi mdi-finance"></i>
                <span>Financial Record</span>
              </router-link>
            </li>

            <li>
              <a href="#" data-toggle="modal" data-target="#con-close-modal">
                <i class="mdi mdi-settings"></i>
                <span>Settings</span>
              </a>
            </li>

            <li>
              <a href="#" @click="logout" ref="logoutButton">
                <i class="mdi mdi-logout"></i>
                <span>Log Out</span>
              </a>
            </li>
          </ul>
        </div>
        <!-- End Sidebar -->

        <div class="clearfix"></div>
      </div>
      <!-- Sidebar -left -->
    </div>

    <div class="content-page">
      <div class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">
              <div class="page-title-box">
                <h4 class="page-title">{{ $route.name }}</h4>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-xl-12">
              <div class="card">
                <div class="card-body">
                  <router-view />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer class="footer">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-12">
              2024 &copy; Student Kiosk by <a href="#">Mharfe M. Micaroz</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>

  <div
    id="con-close-modal"
    class="modal fade center"
    tabindex="-1"
    role="dialog"
    aria-labelledby="myModalLabel"
    style="display: none"
    aria-modal="false"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Change Password</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-12">
              <div class="form-group">
                <label for="current-password" class="control-label"
                  >Current Password</label
                >
                <input
                  type="password"
                  autocomplete="off"
                  class="form-control"
                  id="current-password"
                  v-model="oldpass"
                  placeholder="Enter current password"
                  @input="validateOldPassword"
                />
                <div v-if="oldpassError" class="text-danger">
                  {{ oldpassError }}
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="form-group">
                <label for="new-password" class="control-label"
                  >New Password</label
                >
                <input
                  type="password"
                  autocomplete="off"
                  class="form-control"
                  id="new-password"
                  v-model="newpass"
                  placeholder="Enter new password"
                  @input="validateNewPassword"
                />
                <div v-if="newpassError" class="text-danger">
                  {{ newpassError }}
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="form-group">
                <label for="confirm-password" class="control-label"
                  >Confirm New Password</label
                >
                <input
                  type="password"
                  autocomplete="off"
                  class="form-control"
                  id="confirm-password"
                  v-model="conpass"
                  placeholder="Confirm new password"
                  @input="validateConfirmPassword"
                />
                <div v-if="conpassError" class="text-danger">
                  {{ conpassError }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            ref="closeButton"
            type="button"
            class="btn btn-secondary waves-effect"
            data-dismiss="modal"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-info waves-effect waves-light"
            @click="saveChanges"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  </div>
  <ToasterComponent ref="toast" />
</template>
<script>
import { useAuthStore } from "@/stores/authStore";
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
    };
  },
  methods: {
    async logout() {
      const authStore = useAuthStore();
      const token = authStore.user.token;
      await authStore.logout(token).then((result) => {
        this.$router.push(`/signin`);
      });
    },
    validateOldPassword() {
      if (this.oldpass !== this.currentPassword) {
        this.oldpassError = "Current password is incorrect";
      } else {
        this.oldpassError = "";
      }
    },
    validateNewPassword() {
      if (this.newpass.length < 6) {
        this.newpassError = "New password must be at least 6 characters long";
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
          let dt = await updateStudentById(this.user.id, {
            password: this.newpass,
          });
          this.newpass = "";
          this.oldpass = "";
          this.newpass = "";
          this.isChanged = true;
          this.$refs.closeButton.click();
          this.$refs.toast.showToast(
            "success",
            "Your password is updated successfully!"
          );
          setTimeout(
            function () {
              this.$refs.logoutButton.click();
            }.bind(this),
            2500
          );
        }
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
    const authStore = useAuthStore();
    this.title = document.title;
    this.user = authStore.user[0];
    this.fullname =
      authStore.user[0].firstname + " " + authStore.user[0].surname;
    this.currentPassword = authStore.user[0].password;
    this.loadScript("script1", "/js/vendor.min.js");
    this.loadScript("script2", "/libs/morris-js/morris.min.js");
    this.loadScript("script3", "/libs/morris-js/morris.min.js");
    this.loadScript("script4", "/libs/raphael/raphael.min.js");
    this.loadScript("script5", "/js/pages/dashboard.init.js");
    this.loadScript("script6", "/js/app.min.js");
  },
};
</script>
