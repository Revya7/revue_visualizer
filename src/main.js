import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import 'bootstrap'; import '../src/assets/bootstrap.css';
import { store } from './store/store.js'
import { routes } from './routes/routes.js'

Vue.use(VueRouter);

const router = new VueRouter({
  routes: routes,
  mode: 'history',
  base: 'visualizer'
});

const app = new Vue({
  el: '#app',
  data: { loading: false },
  store,
  router,
  render: h => h(App)
});

function capitalize(str) {
  let newStr = '';
  for(let i = 0; i < str.length; i++) {
    i === 0 ? newStr += str[i].toUpperCase() : newStr += str[i];
  }

  return newStr;
}

router.beforeEach((to, from, next) => {
  app.loading = true;
  store.dispatch('setMode', capitalize(to.name));
  store.dispatch('setPaused', 'cancel');
  setTimeout(() => {
    store.dispatch('setPaused', null);
    next();
  }, 500);
});

router.afterEach((to, from, next) => {
  app.loading = false;
  if(next) {
    next();
  }
});
