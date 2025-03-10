import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import SignIn from "../auth/SigninPage.vue";
import IndexPage from "../main/IndexPage.vue";
import Error403 from "../main/ErrorPage.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/signin",
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
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: "",
          redirect: "index/profile",
        },
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
        {
          path: "chat",
          name: "Chat",
          component: () => import("../main/ChatPage.vue"),
        },
      ],
    },
    {
      path: "/403",
      name: "Error403",
      component: Error403,
    },
    {
      path: "/:catchAll(.*)",
      redirect: { name: "Error403" },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.path === "/signin" && authStore.isAuthenticated) {
    next({ path: "index/profile" });
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

router.addRoute({
  path: "/403/:from*",
  name: "403",
  component: Error403,
  props: (route) => ({ from: route.params.from || "/" }),
});

export default router;
