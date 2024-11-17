import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { VueFire, VueFireAuth } from 'vuefire'

import App from './App.vue'
import router from './router'
import { firebaseApp } from '@/utils/firebase-utils'

const app = createApp(App)

app.use(createPinia())
app.use(router)

/* ---------------------------------------------------------------------------------------------- */
// vue fire config

app.use(VueFire, {
  // imported above but could also just be created here
  firebaseApp,
  modules: [
    // we will see other modules later on
    VueFireAuth(),
  ],
})

/* ---------------------------------------------------------------------------------------------- */

app.mount('#app')
