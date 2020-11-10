import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Room from '../views/Room.vue'
import Design from '../views/Design.vue'
import {store} from '../store'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      public: true
    }
  },
  {
    path: '/room',
    name: 'Room',
    component: Room
  },
  {
    path: '/design',
    name: 'Design',
    component: Design
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {

  if(to.name === "Design"){
    return next()
  }


  const isPublic = to.matched.some(record => record.meta.public)
  
  var loggedIn = store.getters.getInGame

  if(!isPublic && !loggedIn){
    return next('/')
  }

  if(isPublic && loggedIn){
    return next(false)
  }

  next();
})

export default router
