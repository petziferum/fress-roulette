import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import UserDashboard from "@/components/user/MainViewUserDashboard.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/dev/test",
      name: "devtest",
      component: ()=> import("@/views/DevTestView.vue")
    },
    {
      path: "/rezepte",
      name: "Rezept",
      component: ()=> import("@/views/HomeView.vue")
    },
    {
      path: "/user/dashboard",
      name: "userdashboard",
      component: UserDashboard,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
