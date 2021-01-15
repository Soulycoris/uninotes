import "./static/css/main.css";
import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import VueI18n from "vue-i18n";
import I18nMessages from "./assets/i18n/index";

Vue.use(VueI18n);

Vue.config.productionTip = false;

const i18n = new VueI18n({
  locale: "zh-CN",
  messages: I18nMessages,
});

new App({
  i18n,
  store,
}).$mount();
