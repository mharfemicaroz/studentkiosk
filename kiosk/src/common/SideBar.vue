<template>
  <div class="left-side-menu">
    <div class="slimscroll-menu">
      <!--- Sidemenu -->
      <div id="sidebar-menu">
        <ul class="metismenu" id="side-menu">
          <li class="menu-title">Navigation</li>

          <li>
            <router-link to="/index/schedule">
              <i class="mdi mdi-clock-outline"></i>
              <span>Class Schedule</span>
            </router-link>
          </li>

          <li>
            <router-link to="/index/profile">
              <i class="mdi mdi-clock-outline"></i>
              <span>Personal Record</span>
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
        </ul>
      </div>
      <!-- End Sidebar -->

      <div class="clearfix"></div>
    </div>
    <!-- Sidebar -left -->
  </div>
</template>
<script></script>
