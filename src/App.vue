<template>
  <dialog id="spinner" class="loading">
    <div class="container text-center">
      <div class="row align-items-center" style="height: 170px">
        <div class="col">
          <div class="spinner-border" role="status" style="width: 5rem; height: 5rem">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  </dialog>

  <div v-if="!global.initialized" class="container text-center">
    <BsMessage
      message="Initalizing PressureMon Web interface"
      class="h2"
      :dismissable="false"
      alert="info"
    ></BsMessage>
  </div>

  <BsMenuBar 
    v-if="global.initialized" 
    :disabled="global.disabled" 
    brand="PressureMon" 
    :menu-items="menuItems"
    :mdns="config.mdns"
    :dark-mode="config.dark_mode"
    @update:dark-mode="handleDarkModeUpdate"
  />

  <div class="container">
    <div>
      <p></p>
    </div>
    <BsMessage
      v-if="!status.connected"
      message="No response from device, has it gone into sleep model? No need to refresh the page, just turn on the device again"
      class="h2"
      :dismissable="false"
      alert="danger"
    ></BsMessage>

    <BsMessage
      v-if="global.isError"
      :close="close"
      :dismissable="true"
      :message="global.messageError"
      alert="danger"
    />
    <BsMessage
      v-if="global.isWarning"
      :close="close"
      :dismissable="true"
      :message="global.messageWarning"
      alert="warning"
    />
    <BsMessage
      v-if="global.isSuccess"
      :close="close"
      :dismissable="true"
      :message="global.messageSuccess"
      alert="success"
    />
    <BsMessage
      v-if="global.isInfo"
      :close="close"
      :dismissable="true"
      :message="global.messageInfo"
      alert="info"
    />

    <BsMessage v-if="status.wifi_setup" :dismissable="false" alert="info">
      Running in WIFI setup mode. Go to the
      <router-link class="alert-link" to="/device/wifi">wifi settings</router-link>
      meny and select wifi. Restart device after settings are selected.
    </BsMessage>
  </div>

  <router-view v-if="global.initialized" />
  <BsFooter v-if="global.initialized" text="(c) 2024-2025 Magnus Persson" />
</template>

<script setup>

import { onMounted, watch, onBeforeMount, onBeforeUnmount, ref, provide } from 'vue'
import { global, status, config, saveConfigState } from './modules/pinia'
import { useTimers, isValidJson, isValidFormData, isValidMqttData } from '@mp-se/espframework-ui-components'
import { logDebug, logInfo, logError } from './modules/logger'
import { items as menuItems } from './modules/router'

const polling = ref(null)
const { createInterval, clearManagedInterval } = useTimers()

// Provide dependencies for framework fragments
provide('globalStore', global)
provide('configStore', config)
provide('statusStore', status)
provide('logger', { logDebug, logInfo, logError })
provide('isValidJson', isValidJson)
provide('isValidFormData', isValidFormData)
provide('isValidMqttData', isValidMqttData)

const close = (alert) => {
  if (alert == 'danger') global.messageError = ''
  else if (alert == 'warning') global.messageWarning = ''
  else if (alert == 'success') global.messageSuccess = ''
  else if (alert == 'info') global.messageInfo = ''
}

// Handle dark mode changes
const handleDarkModeUpdate = (newValue) => {
  config.dark_mode = newValue
}

watch(() => global.disabled, () => {
  if (global.disabled) document.body.style.cursor = 'wait'
  else document.body.style.cursor = 'default'
})

function ping() {
  status.ping()
}

onBeforeMount(() => {
  polling.value = createInterval(ping, 7000)
})

onBeforeUnmount(() => {
  clearManagedInterval(polling.value)
})

onMounted(async () => {
  if (!global.initialized) {
    showSpinner()
    
    try {
      // Convert callback-based methods to promises for cleaner async/await usage
      const authResult = await new Promise((resolve) => {
        status.auth((success, data) => resolve({ success, data }))
      })
      
      if (!authResult.success) {
        throw new Error('Failed to authenticate with device, please try to reload page!')
      }
      
      global.id = authResult.data.token
      
      const globalLoadResult = await new Promise((resolve) => {
        global.load((success) => resolve(success))
      })
      
      if (!globalLoadResult) {
        throw new Error('Failed to load feature flags from device, please try to reload page!')
      }
      
      const statusLoadResult = await new Promise((resolve) => {
        status.load((success) => resolve(success))
      })
      
      if (!statusLoadResult) {
        throw new Error('Failed to load status from device, please try to reload page!')
      }
      
      const configLoadResult = await new Promise((resolve) => {
        config.load((success) => resolve(success))
      })
      
      if (!configLoadResult) {
        throw new Error('Failed to load configuration data from device, please try to reload page!')
      }
      
      const formatLoadResult = await new Promise((resolve) => {
        config.loadFormat((success) => resolve(success))
      })
      
      if (!formatLoadResult) {
        throw new Error('Failed to load format templates from device, please try to reload page!')
      }
      
      saveConfigState()
      global.initialized = true
      
    } catch (error) {
      global.messageError = error.message
    } finally {
      hideSpinner()
    }
  }
})

function showSpinner() {
  document.querySelector('#spinner').showModal()
}

function hideSpinner() {
  document.querySelector('#spinner').close()
}
</script>

<style>
.loading {
  position: fixed;
  width: 200px;
  height: 200px;
  padding: 10px;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border: 0;
}

dialog::backdrop {
  background-color: black;
  opacity: 60%;
}
</style>
