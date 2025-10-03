import { defineStore } from 'pinia'
import { logInfo, logError, logDebug } from '@mp-se/espframework-ui-components'

export const useGlobalStore = defineStore('global', {
  state: () => {
    return {
      id: '',
      platform: '',

      board: '',
      app_ver: '',
      app_build: '',
      firmware_file: '',

      feature: {
        ble: false,
        no_sensors: 0,
      },

      initialized: false,
      disabled: false,
      configChanged: false,

      messageError: '',
      messageWarning: '',
      messageSuccess: '',
      messageInfo: '',

      fetchTimeout: 8000,
      url: undefined
    }
  },
  getters: {
    isError() {
      return this.messageError != '' ? true : false
    },
    isWarning() {
      return this.messageWarning != '' ? true : false
    },
    isSuccess() {
      return this.messageSuccess != '' ? true : false
    },
    isInfo() {
      return this.messageInfo != '' ? true : false
    },
    token() {
      return 'Bearer ' + this.id
    },
    baseURL() {
      if (this.url !== undefined) return this.url

      if (import.meta.env.VITE_APP_HOST === undefined) {
        logInfo('configStore:baseURL()', 'Using base URL from env', window.location.href)
        this.url = window.location.href
      } else {
        logInfo('configStore:baseURL()', 'Using base URL from env', import.meta.env.VITE_APP_HOST)
        this.url = import.meta.env.VITE_APP_HOST
      }

      return this.url
    },
    uiVersion() {
      logDebug('globalStore.uiVersion()', import.meta.env.VITE_APP_VERSION)
      return import.meta.env.VITE_APP_VERSION
    },
    uiBuild() {
      logDebug('globalStore.uiBuild()', import.meta.env.VITE_APP_BUILD)
      return import.meta.env.VITE_APP_BUILD
    },

  },
  actions: {
    clearMessages() {
      this.messageError = ''
      this.messageWarning = ''
      this.messageSuccess = ''
      this.messageInfo = ''
    },
        // Modern async/await method - keeps callback for backward compatibility
    load(callback) {
      this.loadAsync()
        .then(() => callback(true))
        .catch(() => callback(false))
    },
    
    async loadAsync() {
      logInfo('globalStore.load()', 'Fetching /api/feature')
      
      try {
        const response = await fetch(this.baseURL + 'api/feature', {
          signal: AbortSignal.timeout(this.fetchTimeout)
        })
        
        const json = await response.json()
        logDebug('globalStore.load()', json)
        
        this.board = json.board.toUpperCase()
        this.app_ver = json.app_ver
        this.app_build = json.app_build
        this.platform = json.platform.toUpperCase()
        this.firmware_file = json.firmware_file.toLowerCase()

        this.feature.ble = json.ble
        this.feature.no_sensors = json.no_sensors

        logInfo('globalStore.load()', 'Fetching /api/feature completed')
        return true
      } catch (err) {
        logError('globalStore.load()', err)
        return false
      }
    }
  }
})
