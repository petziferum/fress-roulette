import { createRouter, createWebHistory } from "vue-router";
import UserDashboard from "@/views/MainViewUserDashboard.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
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
      beforeEnter: (to, from, next) => {
        getCurrentUser()
          .then((user) => {
            if (user) {
              next("/user/dashboard");
            } else {
              next();
            }
          })
          .catch((error) => console.log(error));
      },
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
      path: "/recipe/view/:id",
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
    {
      path: "/logout",
      name: "logout",
      component: () => import("@/views/MainViewUserDashboard.vue"),
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
    getCurrentUser().then((user) => {
      if (user) {
        console.info("jupp kannst rein...");
        next();
      } else {
        alert("Nicht angemeldet");
        next("/login");
      }
    });
  } else next();
});

export default router;
