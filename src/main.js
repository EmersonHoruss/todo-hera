import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import { Amplify } from "aws-amplify";
import amplifyconfig from "./amplifyconfiguration.json";
import { router } from "./router";
Amplify.configure(amplifyconfig);

createApp(App).use(router).mount("#app");
