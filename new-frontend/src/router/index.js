import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../pages/LoginPage.vue";
import SignUpPage from "../pages/SignUpPage.vue";
import DashboardPage from "../pages/DashboardPage.vue";

const routes = [
  { path: "/", name: "Login", component: LoginPage },
  { path: "/signup", component: SignUpPage },
  { path: "/dashboard", component: DashboardPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
