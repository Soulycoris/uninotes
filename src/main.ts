import "./static/css/main.css";
import Vue from "vue";
import App from "./App.vue";
import store from "./store";

Vue.config.productionTip = false;

new App({
  store,
}).$mount();
