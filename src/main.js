import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

import piniaInstance from './modules/pinia.js'
app.use(piniaInstance)

import router from './modules/router.js'
app.use(router)

import {
  // UI Components
  BsMessage,
  BsCard,
  BsFileUpload,
  BsProgress,
  BsInputBase,
  BsInputText,
  BsInputReadonly,
  BsSelect,
  BsInputTextArea,
  BsInputNumber,
  BsInputSwitch,
  BsInputRadio,
  BsDropdown,
  BsModal,
  BsModalConfirm,
  BsInputTextAreaFormat,
  BsMenuBar,
  BsFooter,
  // Icon Components
  IconHome,
  IconTools,
  IconGraphUpArrow,
  IconCloudUpArrow,
  IconUpArrow,
  IconCpu,
  IconEye,
  IconEyeSlash,
  IconCheckCircle,
  IconXCircle,
  IconInfoCircle,
  IconExclamationTriangle,
  IconWifi
} from '@mp-se/espframework-ui-components'

app.component('BsMessage', BsMessage)
app.component('BsDropdown', BsDropdown)
app.component('BsCard', BsCard)
app.component('BsFileUpload', BsFileUpload)
app.component('BsProgress', BsProgress)
app.component('BsMenuBar', BsMenuBar)
app.component('BsFooter', BsFooter)
app.component('BsInputBase', BsInputBase)
app.component('BsInputText', BsInputText)
app.component('BsInputReadonly', BsInputReadonly)
app.component('BsSelect', BsSelect)
app.component('BsInputTextArea', BsInputTextArea)
app.component('BsInputNumber', BsInputNumber)
app.component('BsInputRadio', BsInputRadio)
app.component('BsInputSwitch', BsInputSwitch)

// Icons imported above in combined import statement

app.component('IconHome', IconHome)
app.component('IconTools', IconTools)
app.component('IconGraphUpArrow', IconGraphUpArrow)
app.component('IconCloudUpArrow', IconCloudUpArrow)
app.component('IconUpArrow', IconUpArrow)
app.component('IconCpu', IconCpu)
app.component('IconEye', IconEye)
app.component('IconEyeSlash', IconEyeSlash)
app.component('IconCheckCircle', IconCheckCircle)
app.component('IconXCircle', IconXCircle)
app.component('IconInfoCircle', IconInfoCircle)
app.component('IconExclamationTriangle', IconExclamationTriangle)
app.component('IconWifi', IconWifi)

// Modal components imported above in combined import statement

app.component('BsModal', BsModal)
app.component('BsModalConfirm', BsModalConfirm)
app.component('BsInputTextAreaFormat', BsInputTextAreaFormat)

// Import Bootstrap CSS and JS first, then library CSS to allow overrides
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import '@mp-se/espframework-ui-components/dist/style.css'

app.mount('#app')
