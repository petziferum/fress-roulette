import { createRouter, createWebHistory } from "vue-router";
import UserDashboard from "@/views/MainViewUserDashboard.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: "/roulette",
      name: "roulette",
      component: () => import("@/views/TheRouletteView.vue"),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/views/RegisterView.vue"),
    },
    {
      path: "/recipe/edit/:id",
      name: "newRecipe",
      component: () => import("@/views/EditRecipeView.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/recipe/view/:name",
      name: "viewRecipe",
      component: () => import("@/views/TheRecipeDetailsView.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/dev/test",
      name: "devtest",
      component: () => import("@/views/DevTestView.vue"),
    },
    {
      path: "/rezepte",
      name: "Rezept",
      component: () => import("@/views/HomeView.vue"),
    },
    {
      path: "/user/dashboard",
      name: "userdashboard",
      component: UserDashboard,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("@/views/AboutView.vue"),
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      console.info("jupp kannst rein...");
      next();
    } else {
      alert("Nicht angemeldet");
      next("/login");
    }
  } else next();
});

export default router;
