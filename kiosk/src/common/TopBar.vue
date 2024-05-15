<template>
  <div class="navbar-custom">
    <ul class="list-unstyled topnav-menu float-right mb-0">
      <li class="dropdown notification-list">
        <a
          class="nav-link dropdown-toggle nav-user mr-0 waves-effect waves-light"
          data-toggle="dropdown"
          href="#"
          role="button"
          aria-haspopup="false"
          aria-expanded="false"
        >
          <img
            src="/images/users/avatar-1.jpg"
            alt="user-image"
            class="rounded-circle"
          />
        </a>
        <div class="dropdown-menu dropdown-menu-right profile-dropdown">
          <!-- item-->
          <div class="dropdown-header noti-title">
            <h6 class="text-overflow m-0">Welcome !</h6>
          </div>

          <!-- item-->
          <a href="javascript:void(0);" class="dropdown-item notify-item">
            <i class="mdi mdi-account-outline"></i>
            <span>Profile</span>
          </a>

          <!-- item-->
          <a href="javascript:void(0);" class="dropdown-item notify-item">
            <i class="mdi mdi-settings-outline"></i>
            <span>Settings</span>
          </a>

          <div class="dropdown-divider"></div>

          <!-- item-->
          <a
            href="javascript:void(0);"
            @click="logout"
            class="dropdown-item notify-item"
          >
            <i class="mdi mdi-logout-variant"></i>
            <span>Logout</span>
          </a>
        </div>
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

      <li class="d-none d-sm-block">
        <form class="app-search">
          <div class="app-search-box">
            <div class="input-group">
              <input type="text" class="form-control" placeholder="Search..." />
              <div class="input-group-append">
                <button class="btn" type="submit">
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>
        </form>
      </li>
    </ul>
  </div>
</template>
<script></script>
