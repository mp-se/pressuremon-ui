import { defineStore } from 'pinia'
import { global } from '@/modules/pinia'
import { logDebug, logError, logInfo } from '@mp-se/espframework-ui-components'

export const useStatusStore = defineStore('status', {
  state: () => {
    return {
      id: '',

      pressure: 10,
      pressure1: 11,
      pressure_unit: 'PSI',
      temp: 20.2,
      temp1: 20.5,
      temp_unit: 'C',

      sleep_interval: 0,
      battery: 0,
      sleep_mode: false,
      rssi: 0,
      mdns: '',
      wifi_ssid: '',
      ip: '',
      total_heap: 0,
      free_heap: 0,
      self_check: {
        sensor_configured: true,
        sensor_connected: true,
        temp_connected: true,
        battery_level: true,
        push_targets: true
      },
      wifi_setup: false,
      max_sensors: 1,
      adc_found: false,
      connected: true
    }
  },
  getters: {
    isPsi() {
      return this.pressure_unit === 'PSI'
    },
    isBar() {
      return this.pressure_unit === 'Bar'
    },
    isKPa() {
      return this.pressure_unit === 'kPa'
    }
  },
  actions: {
    // Modern async/await method - keeps callback for backward compatibility
    load(callback) {
      this.loadAsync()
        .then(() => callback(true))
        .catch(() => callback(false))
    },
    
    async loadAsync() {
      logInfo('statusStore.load()', 'Fetching /api/status')
      
      try {
        const response = await fetch(global.baseURL + 'api/status', {
          signal: AbortSignal.timeout(global.fetchTimeout)
        })
        
        const json = await response.json()
        logDebug('statusStore.load()', json)
        
        this.id = json.id
        this.pressure = json.pressure
        this.pressure1 = json.pressure1
        this.pressure_unit = json.pressure_unit
        this.temp = json.temp
        this.temp1 = json.temp1
        this.temp_unit = json.temp_unit

        this.sleep_mode = json.sleep_mode
        this.battery = json.battery
        this.rssi = json.rssi
        this.mdns = json.mdns
        this.wifi_ssid = json.wifi_ssid
        this.ip = json.ip

        this.self_check.sensor_connected = json.self_check.sensor_connected
        this.self_check.sensor_configured = json.self_check.sensor_configured
        this.self_check.gyro_calibration = json.self_check.gyro_calibration
        this.self_check.battery_level = json.self_check.battery_level
        this.self_check.push_targets = json.self_check.push_targets

        this.total_heap = json.total_heap
        this.free_heap = json.free_heap
        this.wifi_setup = json.wifi_setup
        this.max_sensors = json.max_sensors
        this.adc_found = json.adc_found

        this.total_heap = Math.round(this.total_heap / 1024).toFixed(0)
        this.free_heap = Math.round(this.free_heap / 1024).toFixed(0)

        if (this.pressure !== undefined)
          this.pressure = (Math.round(this.pressure * 100) / 100).toFixed(2)

        if (this.pressure1 !== undefined)
          this.pressure1 = (Math.round(this.pressure1 * 100) / 100).toFixed(2)

        if (this.temp !== undefined) 
          this.temp = (Math.round(this.temp * 100) / 100).toFixed(2)

        if (this.temp1 !== undefined) 
          this.temp1 = (Math.round(this.temp1 * 100) / 100).toFixed(2)

        this.battery = (Math.round(this.battery * 100) / 100).toFixed(2)

        logInfo('statusStore.load()', 'Fetching /api/status completed')
        return true
      } catch (err) {
        logError('statusStore.load()', err)
        return false
      }
    },
    // Modern async/await method - keeps callback for backward compatibility
    auth(callback) {
      this.authAsync()
        .then((result) => callback(true, result))
        .catch(() => callback(false))
    },
    
    async authAsync() {
      logInfo('statusStore.auth()', 'Fetching /api/auth')
      const base = btoa('gravitymon:password')
      
      try {
        const response = await fetch(global.baseURL + 'api/auth', {
          method: 'GET',
          headers: { Authorization: 'Basic ' + base },
          signal: AbortSignal.timeout(global.fetchTimeout)
        })
        
        const json = await response.json()
        logInfo('statusStore.auth()', 'Fetching /api/auth completed')
        return { success: true, data: json }
      } catch (err) {
        logError('statusStore.auth()', err)
        return { success: false, error: err }
      }
    },
    async ping() {
      // logInfo("statusStore.ping()", "Fetching /api/ping")
      try {
        const response = await fetch(global.baseURL + 'api/ping', {
          method: 'GET',
          signal: AbortSignal.timeout(global.fetchTimeout)
        })
        
        await response.json()
        // logInfo("statusStore.ping()", "Fetching /api/auth completed")
        this.connected = true
      } catch (err) {
        logError('statusStore.ping()', err)
        this.connected = false
      }
    },
    // Modern async method - keeps callback for backward compatibility
    setSleepMode(val, callback) {
      this.setSleepModeAsync(val)
        .then(() => callback(true))
        .catch(() => callback(false))
    },
    
    async setSleepModeAsync(val) {
      logInfo('statusStore.setSleepMode()', 'Fetching /api/config/sleepmode')
      
      try {
        const response = await fetch(global.baseURL + 'api/sleepmode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: global.token
          },
          body: JSON.stringify({ sleep_mode: val }),
          signal: AbortSignal.timeout(global.fetchTimeout)
        })
        
        const json = await response.json()
        logInfo('statusStore.setSleepMode()', 'Fetching /api/sleepmode completed', json)
        
      } catch (err) {
        logError('statusStore.setSleepMode()', err)
        throw err
      }
    }
  }
})
