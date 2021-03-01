import Vue from 'vue'
import VueRouter from 'vue-router'

import Index from '../components/index/Index.vue'
import Main from '../components/public/Main.vue'
import Question from '../components/question/Question.vue'
import Detail from '../components/detail/Detail.vue'
import Profile from '../components/profile/Profile.vue'
import ProfileChange from '../components/profile/ProfileChange.vue'
import Rank from '../components/rank/Rank.vue'

import store from '../store/index'
import axios from 'axios'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'Index',
    component: Index
  },
  {
    path: '/main',
    name: 'Main',
    component: Main,
    children: [
      {
        path: 'question',
        name: 'Question',
        component: Question
      },
      {
        path: 'question/detail',
        redirect: 'question/detail/1'
      },
      {
        path: 'question/detail/:problemID',
        name: 'Detail',
        component: Detail
      },
      {
        path: 'profile',
        redirect: 'profile/' + store.state.user
      },
      {
        path: 'profile/:userID',
        name: 'Profile',
        component: Profile
      },
      {
        path: 'changeprofile',
        name: 'ChangeProfile',
        component: ProfileChange
      },
      {
        path: 'rank',
        name: 'Rank',
        component: Rank
      },
      {
        path: '',
        redirect: '/main/question'
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


// 防止路由重复，原理待研究
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location){
  return originalPush.call(this, location).catch(err => err);
}

router.beforeEach(( to, from, next ) => {
  if (from.name == to.name) next(false);  // 貌似没用...?
  if (to.name != 'Index') {
    if (store.state.user) next();
    else {
      // 检查登录信息
      axios.get('/api/guest/islogin').then( ret => {
        if (ret.data.msg === "pass"){
          store.state.user = ret.data.user;
          next();
        } else {
          next('/index');
        }
      }).catch( err => {
        next('/index');
      })
    }
  }
  else next();
})

export default router
