

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import './styles/main.css'

import WordList from './pages/WordList.vue'
import Train from './pages/Train.vue';
import Progress from './pages/Progress.vue';

const router = createRouter({
  routes: [{
    path: '/',
    name: 'words',
    component: WordList
  },
    {
    path: '/train',
    name: 'train',
    component: Train
  },
    {
    path: '/progress',
    name: 'progress',
    component: Progress
  }],
  history: createWebHistory()
})

const app = createApp(App)
app.use(router)
app.mount('#app')
