import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import SignIn from "../auth/SigninPage.vue";
import IndexPage from "../main/IndexPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "SignIn",
      component: SignIn,
    },
    {
      path: "/signin",
      name: "SignIn",
      component: SignIn,
    },
    {
      path: "/index",
      name: "IndexPage",
      component: IndexPage,
      children: [
        {
          path: "schedule",
          name: "Class Schedule",
          component: () => import("../main/SchedulePage.vue"),
        },
        {
          path: "profile",
          name: "Personal Record",
          component: () => import("../main/ProfilePage.vue"),
        },
        {
          path: "finance",
          name: "Financial Record",
          component: () => import("../main/FinancePage.vue"),
        },
        {
          path: "evaluation",
          name: "Academic Record",
          component: () => import("../main/EvaluationPage.vue"),
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.path === "/signin" && authStore.isAuthenticated) {
    next({ path: "index/schedule" });
  } else if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      next({ name: "SignIn" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
