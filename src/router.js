import { createRouter, createWebHistory } from "vue-router";
import User from "./User.vue";
import Todo from "./Todo.vue";

const routes = [
  { path: "/users", component: User },
  { path: "/todos", component: Todo },
  { path: "/", redirect: "/users" }, // Default route
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
