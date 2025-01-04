import { createRouter, createWebHistory } from "vue-router";

// Importing components for routes
import LoginPage from "../pages/LoginPage.vue";
import SignUpPage from "../pages/SignUpPage.vue";
import DashboardPage from "../pages/DashboardPage.vue";
import LeagueCreationPage from "../pages/LeagueCreationPage.vue";
import LeaguePage from "../pages/LeaguePage.vue";
import DraftPage from "../pages/DraftPage.vue";
import PrivacyPolicy from "../pages/PrivacyPolicy.vue";
import TermsOfService from "../pages/TermsOfService.vue";
import FeedbackForm from "../pages/FeedbackForm.vue";
import JoinLeaguePage from "../pages/JoinLeaguePage.vue";
import BrowseLeaguesPage from "../pages/BrowseLeaguesPage.vue";
import ErrorPage from "../pages/ErrorPage.vue";
import ProfilePage from "../pages/ProfilePage.vue";
import ForgotPasswordPage from "../pages/ForgotPasswordPage.vue";
import AdminPage from "../pages/AdminPage.vue";

// Define the routes
const routes = [
  { path: "/", name: "Login", component: LoginPage },
  { path: "/signup", name: "SignUp", component: SignUpPage },
  { path: "/dashboard", name: "Dashboard", component: DashboardPage },
  { path: "/create-league", name: "CreateLeague", component: LeagueCreationPage },
  { path: "/league/:leagueId", name: "LeaguePage", component: LeaguePage }, // Consistent naming for dynamic parameter
  { path: "/draft/:leagueId", name: "DraftPage", component: DraftPage },
  { path: "/privacy-policy", name: "PrivacyPolicy", component: PrivacyPolicy },
  { path: "/terms-of-service", name: "TermsOfService", component: TermsOfService },
  { path: "/feedback", name: "FeedbackForm", component: FeedbackForm },
  { path: "/join-league", name: "JoinLeague", component: JoinLeaguePage },
  { path: "/browse-leagues", name: "BrowseLeagues", component: BrowseLeaguesPage },
  { path: "/profile", name: "Profile", component: ProfilePage },
  { path: "/forgot-password", name: "ForgotPassword", component: ForgotPasswordPage },
  { path: "/admin", name: "AdminPage", component: AdminPage },
  { path: "/:catchAll(.*)", name: "ErrorPage", component: ErrorPage }, // Catch-all for 404 errors
];

// Create the router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

