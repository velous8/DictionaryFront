import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";
import "./styles/main.css";

import WordList from "./pages/WordList.vue";
import Train from "./pages/Train.vue";
import Progress from "./pages/Progress.vue";
import Register from "./pages/Register.vue";
import Login from "./pages/Login.vue";
import AdminPanel from "./pages/AdminWords.vue";

import { isAdmin } from "./utils/auth";
import { useAuth } from "./composables/useAuth"; // путь под свой проект

const router = createRouter({
  routes: [
    {
      path: "/",
      name: "words",
      component: WordList,
    },
    {
      path: "/train",
      name: "train",
      component: Train,
    },
    {
      path: "/progress",
      name: "progress",
      component: Progress,
    },
    {
      path: "/register",
      name: "register",
      component: Register,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/admin",
      name: "admin",
      component: AdminPanel,
      meta: { requiresAdmin: true },
    },
  ],
  history: createWebHistory(),
});

// Защита админских роутов: не админ → сразу на "/"
router.beforeEach((to) => {
  if (to.meta.requiresAdmin && !isAdmin()) {
    return { path: "/" };
  }
});

const app = createApp(App);
app.use(router);
app.mount("#app");

useAuth().init();
