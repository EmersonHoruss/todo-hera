import { createRouter, createWebHistory } from "vue-router";
import User from "./pages/User.vue";
import Todo from "./pages/Todo.vue";

const routes = [
  { path: "/users", component: User },
  { path: "/todos", component: Todo },
  { path: "/", redirect: "/users" }, // Default route
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
