import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 引入element-ui
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Element)

// 引入富文本编辑器
import  QuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(QuillEditor)

// 引入echarts
import * as echarts from 'echarts';
Vue.use(echarts);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
