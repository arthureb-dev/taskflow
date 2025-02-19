import './bootstrap'
import { createApp } from 'vue'
import TaskApp from './components/TaskApp.vue'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const app = createApp({})

app.use(Vue3Toastify, {
    autoClose: 1000,
    theme: 'colored',
    transition: 'flip',
    limit: 1,
})

app.component('task-app', TaskApp)

app.mount('#app')
