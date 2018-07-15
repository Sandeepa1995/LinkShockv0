import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Register from '@/components/Register'
import Login from '@/components/Login'
import SuperLink from '@/components/SuperLink'
import Link from '@/components/Link'
import Shock from '@/components/Shock'


Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/superlink',
      name: 'SuperLink',
      component: SuperLink
    },
    {
      path: '/link_let_me_pass',
      name: 'Link',
      component: Link
    },
    {
      path: '/shock_let_me_pass',
      name: 'Shock',
      component: Shock
    }
  ]
})
