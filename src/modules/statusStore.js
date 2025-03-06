import { defineStore } from 'pinia'
import { global } from '@/modules/pinia'
import { logDebug, logError, logInfo } from '@/modules/logger'

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
      app_ver: '',
      app_build: '',
      mdns: '',
      platform: '',
      wifi_ssid: '',
      ip: '',
      runtime_average: 0,
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
    load(callback) {
      logInfo('statusStore.load()', 'Fetching /api/status')
      fetch(global.baseURL + 'api/status', {
        signal: AbortSignal.timeout(global.fetchTimout)
      })
        .then((res) => res.json())
        .then((json) => {
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
          this.app_ver = json.app_ver
          this.app_build = json.app_build
          this.mdns = json.mdns
          this.platform = json.platform
          this.wifi_ssid = json.wifi_ssid
          this.ip = json.ip
          this.runtime_average = json.runtime_average

          this.self_check.sensor_connected = json.self_check.sensor_connected
          this.self_check.sensor_configured = json.self_check.sensor_configured
          this.self_check.gyro_calibration = json.self_check.gyro_calibration
          this.self_check.battery_level = json.self_check.battery_level
          this.self_check.push_targets = json.self_check.push_targets

          this.total_heap = json.total_heap
          this.free_heap = json.free_heap
          this.wifi_setup = json.wifi_setup

          this.total_heap = Math.round(this.total_heap / 1024).toFixed(0)
          this.free_heap = Math.round(this.free_heap / 1024).toFixed(0)

          if (this.pressure !== undefined)
            this.pressure = (Math.round(this.pressure * 100) / 100).toFixed(2)

          if (this.pressure1 !== undefined)
            this.pressure1 = (Math.round(this.pressure1 * 100) / 100).toFixed(2)

          if (this.temp !== undefined) this.temp = (Math.round(this.temp * 100) / 100).toFixed(2)

          if (this.temp1 !== undefined) this.temp1 = (Math.round(this.temp1 * 100) / 100).toFixed(2)

          this.battery = (Math.round(this.battery * 100) / 100).toFixed(2)
          this.runtime_average = (Math.round(this.runtime_average * 100) / 100).toFixed(2)

          logInfo('statusStore.load()', 'Fetching /api/status completed')
          callback(true)
        })
        .catch((err) => {
          logError('statusStore.load()', err)
          callback(false)
        })
    },
    auth(callback) {
      logInfo('statusStore.auth()', 'Fetching /api/auth')
      var base = btoa('gravitymon:password')

      fetch(global.baseURL + 'api/auth', {
        method: 'GET',
        headers: { Authorization: 'Basic ' + base },
        signal: AbortSignal.timeout(global.fetchTimout)
      })
        .then((res) => res.json())
        .then((json) => {
          logInfo('statusStore.auth()', 'Fetching /api/auth completed')
          callback(true, json)
        })
        .catch((err) => {
          logError('statusStore.auth()', err)
          callback(false)
        })
    },
    ping() {
      // logInfo("statusStore.ping()", "Fetching /api/ping")
      fetch(global.baseURL + 'api/ping', {
        method: 'GET',
        signal: AbortSignal.timeout(global.fetchTimout)
      })
        .then((res) => res.json())
        .then(() => {
          // logInfo("statusStore.ping()", "Fetching /api/auth completed")
          this.connected = true
        })
        .catch((err) => {
          logError('statusStore.ping()', err)
          this.connected = false
        })
    },
    setSleepMode(val, callback) {
      logInfo('statusStore.setSleepMode()', 'Fetching /api/config/sleepmode')
      fetch(global.baseURL + 'api/sleepmode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: global.token
        },
        body: JSON.stringify({ sleep_mode: val }),
        signal: AbortSignal.timeout(global.fetchTimout)
      })
        .then((res) => res.json())
        .then((json) => {
          logInfo('statusStore.setSleepMode()', 'Fetching /api/sleepmode completed', json)
          callback(true)
        })
        .catch((err) => {
          logError('statusStore.setSleepMode()', err)
          callback(false)
        })
    }
  }
})
