import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Room from '../views/Room.vue'
import {store} from '../store'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      public: true,
      onlyWhenOutGame: true
    }
  },
  {
    path: '/room',
    name: 'Room',
    component: Room
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const isPublic = to.matched.some(record => record.meta.public)
  const onlyWhenOutGame = to.matched.some(record => record.meta.onlyWhenOutGame)
  
  var loggedIn = store.getters.getInGame

  if(!isPublic && !loggedIn){
    return next('/')
  }
  console.log(loggedIn)

  if(loggedIn && onlyWhenOutGame){
    return next('/room')
  }
  console.log(loggedIn)

  next();
})

export default router
