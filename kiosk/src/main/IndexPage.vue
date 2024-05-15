<template>
  <div id="wrapper">
    <div class="navbar-custom">
      <ul class="list-unstyled topnav-menu float-right mb-0">
        <li class="dropdown notification-list">
          <a class="nav-link mr-0 waves-effect waves-light" href="#">
            {{ fullname }}
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
              <a href="#" @click="logout">
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
</template>
<script>
import { useAuthStore } from "@/stores/authStore";
export default {
  data() {
    return {
      title: "",
      fullname: "",
      role: "",
    };
  },
  methods: {
    async logout() {
      const authStore = useAuthStore();
      const token = authStore.user.token;
      await authStore.logout(token).then((result) => {
        this.$router.push(`/signin`);
        setTimeout(() => {
          this.$router.go(0);
        }, 1);
      });
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
    this.fullname =
      authStore.user[0].firstname + " " + authStore.user[0].surname;
    this.role = authStore.user.role;
    this.loadScript("script1", "/js/vendor.min.js");
    this.loadScript("script2", "/libs/morris-js/morris.min.js");
    this.loadScript("script3", "/libs/morris-js/morris.min.js");
    this.loadScript("script4", "/libs/raphael/raphael.min.js");
    this.loadScript("script5", "/js/pages/dashboard.init.js");
    this.loadScript("script6", "/js/app.min.js");
  },
};
</script>
