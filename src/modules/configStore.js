import { defineStore } from 'pinia'
import { global, saveConfigState, getConfigChanges } from '@/modules/pinia'
import { getErrorString } from '@/modules/utils'
import { logDebug, logError, logInfo } from '@/modules/logger'
import { tempToC, tempToF, roundVal } from '@/modules/utils'

export const useConfigStore = defineStore('config', {
  state: () => {
    return {
      // Device
      id: '',
      mdns: '',
      temp_unit: '',
      // Hardware
      ota_url: '',
      voltage_factor: 0,
      voltage_config: 0,
      gyro_temp: false,
      battery_saving: false,
      battery_type: 0,
      tempsensor_resolution: 0,
      temp_adjustment_value: 0, // C or F
      voltage_pin: 0,
      sensor_type: 0,
      sensor1_type: 0,
      pressure_adjustment: 0.0,
      pressure1_adjustment: 0.0,
      custom_min_voltage: 0,
      custom_max_voltage: 0,
      custom_min_pressure: 0,
      custom_max_pressure: 0,
      custom1_min_voltage: 0,
      custom1_max_voltage: 0,
      custom1_min_pressure: 0,
      custom1_max_pressure: 0,
      // temp_adjustment: 0.0,
      // temp1_adjustment: 0.0,
      pressure_unit: 'psi',
      // Wifi
      wifi_portal_timeout: 0,
      wifi_connect_timeout: 0,
      wifi_ssid: '',
      wifi_ssid2: '',
      wifi_pass: '',
      wifi_pass2: '',
      wifi_direct_ssid: '',
      wifi_direct_pass: '',
      use_wifi_direct: false,
      wifi_scan_ap: false,
      // Push - Generic
      token: '',
      token2: '',
      sleep_interval: 0,
      push_timeout: 0,
      // Push - Http Post 1
      http_post_target: '',
      http_post_header1: '',
      http_post_header2: '',
      http_post_int: 0,
      http_post_format_pressure: '',
      // Push - Http Post 2
      http_post2_target: '',
      http_post2_header1: '',
      http_post2_header2: '',
      http_post2_int: 0,
      http_post2_format_pressure: '',
      // Push - Http Get
      http_get_target: '',
      http_get_header1: '',
      http_get_header2: '',
      http_get_int: 0,
      http_get_format_pressure: '',
      // Push - Influx
      influxdb2_target: '',
      influxdb2_org: '',
      influxdb2_bucket: '',
      influxdb2_token: '',
      influxdb2_int: 0,
      influxdb2_format_pressure: '',
      // Push - MQTT
      mqtt_target: '',
      mqtt_port: '',
      mqtt_user: '',
      mqtt_pass: '',
      mqtt_int: 0,
      mqtt_format_pressure: '',
      // Push BLE
      ble_format: 0,
      // Gravity formula
      dark_mode: false
    }
  },
  actions: {
    convertTemp() {
      if (this.temp_unit == this.internal_temp_unit) return
      if (this.temp_unit == 'C') this.convertTempToC()
      if (this.temp_unit == 'F') this.convertTempToF()
    },
    convertTempToC() {
      if (this.internal_temp_unit == 'C') return

      this.temp_adjustment_value = roundVal(this.temp_adjustment_value / 1.8, 2)
      this.formula_calibration_temp = roundVal(tempToC(this.formula_calibration_temp), 2)
      this.internal_temp_unit = 'C'
    },
    convertTempToF() {
      if (this.internal_temp_unit == 'F') return

      this.temp_adjustment_value = roundVal(this.temp_adjustment_value * 1.8, 2) // Delta value
      this.formula_calibration_temp = roundVal(tempToF(this.formula_calibration_temp), 2)
      this.internal_temp_unit = 'F'
    },
    toJson() {
      logInfo('configStore.toJSON()')
      const dest = {}

      for (const key in this.$state) {
        if (!key.startsWith('$')) {
          dest[key] = this[key]
        }
      }

      logInfo('configStore.toJSON()', dest)
      return JSON.stringify(dest, null, 2)
    },
    // Modern async/await method - keeps callback for backward compatibility
    load(callback) {
      this.loadAsync()
        .then(() => callback(true))
        .catch(() => callback(false))
    },
    
    async loadAsync() {
      global.disabled = true
      logInfo('configStore.load()', 'Fetching /api/config')
      
      try {
        const response = await fetch(global.baseURL + 'api/config', {
          method: 'GET',
          headers: { Authorization: global.token },
          signal: AbortSignal.timeout(global.fetchTimout)
        })
        
        const json = await response.json()
        logDebug('configStore.load()', json)
        
        global.disabled = false
        this.id = json.id
        // Device
        this.mdns = json.mdns
        this.temp_unit = json.temp_unit
        // Hardware
        this.ota_url = json.ota_url
        this.voltage_factor = json.voltage_factor
        this.voltage_config = json.voltage_config
        this.battery_saving = json.battery_saving
        this.battery_type = json.battery_type
        this.sensor_type = json.sensor_type
        this.sensor1_type = json.sensor1_type
        this.pressure_adjustment = json.pressure_adjustment
        this.pressure1_adjustment = json.pressure1_adjustment
        this.custom_min_voltage = json.custom_min_voltage
        this.custom_max_voltage = json.custom_max_voltage
        this.custom_min_pressure = json.custom_min_pressure
        this.custom_max_pressure = json.custom_max_pressure
        this.custom1_min_voltage = json.custom1_min_voltage
        this.custom1_max_voltage = json.custom1_max_voltage
        this.custom1_min_pressure = json.custom1_min_pressure
        this.custom1_max_pressure = json.custom1_max_pressure
        // this.temp_adjustment = json.temp_adjustment
        // this.temp1_adjustment = json.temp1_adjustment
        this.pressure_unit = json.pressure_unit
        this.temp_adjustment_value = json.temp_adjustment_value
        this.tempsensor_resolution = json.tempsensor_resolution
        this.wifi_portal_timeout = json.wifi_portal_timeout
        this.wifi_connect_timeout = json.wifi_connect_timeout
        this.wifi_ssid = json.wifi_ssid
        this.wifi_ssid2 = json.wifi_ssid2
        this.wifi_pass = json.wifi_pass
        this.wifi_pass2 = json.wifi_pass2
        this.wifi_direct_ssid = json.wifi_direct_ssid
        this.wifi_direct_pass = json.wifi_direct_pass
        this.use_wifi_direct = json.use_wifi_direct
        this.wifi_scan_ap = json.wifi_scan_ap
        // Push - Generic
        this.token = json.token
        this.token2 = json.token2
        this.sleep_interval = json.sleep_interval
        this.push_timeout = json.push_timeout
        // Push - Http Post 1
        this.http_post_target = json.http_post_target
        this.http_post_header1 = json.http_post_header1
        this.http_post_header2 = json.http_post_header2
        this.http_post_int = json.http_post_int
        // this.http_post_format_pressure = json.http_post_format_pressure
        // Push - Http Post 2
        this.http_post2_target = json.http_post2_target
        this.http_post2_header1 = json.http_post2_header1
        this.http_post2_header2 = json.http_post2_header2
        this.http_post2_int = json.http_post2_int
        // this.http_post2_format_pressure = json.http_post2_format_pressure
        // Push - Http Get
        this.http_get_target = json.http_get_target
        this.http_get_header1 = json.http_get_header1
        this.http_get_header2 = json.http_get_header2
        this.http_get_int = json.http_get_int
        // this.http_get_format_pressure = json.http_get_format_pressure
        // Push - Influx
        this.influxdb2_target = json.influxdb2_target
        this.influxdb2_org = json.influxdb2_org
        this.influxdb2_bucket = json.influxdb2_bucket
        this.influxdb2_token = json.influxdb2_token
        this.influxdb2_int = json.influxdb2_int
        // this.influxdb2_format_pressure = json.influxdb2_format_pressure
        // Push - MQTT
        this.mqtt_target = json.mqtt_target
        this.mqtt_port = json.mqtt_port
        this.mqtt_user = json.mqtt_user
        this.mqtt_pass = json.mqtt_pass
        this.mqtt_int = json.mqtt_int
        // this.mqtt_format_pressure = json.mqtt_format_pressure
        // Push BLE
        this.ble_format = json.ble_format
        this.dark_mode = json.dark_mode

        this.internal_temp_unit = 'C'
        this.convertTemp()
      } catch (err) {
        global.disabled = false
        logError('configStore.load()', err)
        throw err
      }
    },
    // Modern async method - keeps callback for backward compatibility
    loadFormat(callback) {
      this.loadFormatAsync()
        .then(() => callback(true))
        .catch(() => callback(false))
    },
    
    async loadFormatAsync() {
      global.disabled = true
      logInfo('configStore.loadFormat()', 'Fetching /api/format')
      
      try {
        const response = await fetch(global.baseURL + 'api/format', {
          method: 'GET',
          headers: { Authorization: global.token },
          signal: AbortSignal.timeout(global.fetchTimout)
        })
        
        const json = await response.json()
        logDebug('configStore.loadFormat()', json)
        
        this.http_post_format_pressure = decodeURIComponent(json.http_post_format_pressure)
        this.http_post2_format_pressure = decodeURIComponent(json.http_post2_format_pressure)
        this.http_get_format_pressure = decodeURIComponent(json.http_get_format_pressure)
        this.influxdb2_format_pressure = decodeURIComponent(json.influxdb2_format_pressure)
        this.mqtt_format_pressure = decodeURIComponent(json.mqtt_format_pressure)

        // Add linebreaks so the editor shows the data correctly
        this.mqtt_format_pressure = this.mqtt_format_pressure.replaceAll('|', '|\n')
        
      } catch (err) {
        logError('configStore.loadFormat()', err)
        throw err
      } finally {
        global.disabled = false
      }
    },
    sendConfig(callback) {
      global.disabled = true
      logInfo('configStore.sendConfig()', 'Sending /api/config')

      this.convertTempToC() // Device use C internally

      var data = getConfigChanges()
      delete data.http_post_format_pressure
      delete data.http_post2_format_pressure
      delete data.http_get_format_pressure
      delete data.influxdb2_format_pressure
      delete data.mqtt_format_pressure
      logDebug('configStore.sendConfig()', data)

      if (JSON.stringify(data).length == 2) {
        logInfo('configStore.sendConfig()', 'No config data to store, skipping step')
        global.disabled = false
        this.convertTemp()
        callback(true)
        return
      }

      fetch(global.baseURL + 'api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: global.token
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(global.fetchTimout)
      })
        .then((res) => {
          global.disabled = false
          if (res.status != 200) {
            logError('configStore.sendConfig()', 'Sending /api/config failed', res.status)
            this.convertTemp()
            callback(false)
          } else {
            logInfo('configStore.sendConfig()', 'Sending /api/config completed')
            this.convertTemp()
            callback(true)
          }
        })
        .catch((err) => {
          logError('configStore.sendConfig()', err)
          this.convertTemp()
          callback(false)
          global.disabled = false
        })
    },
    // Modern async/await method - keeps callback for backward compatibility
    sendFormat(callback) {
      this.sendFormatAsync()
        .then(() => callback(true))
        .catch(() => callback(false))
    },
    
    async sendFormatAsync() {
      global.disabled = true
      logInfo('configStore.sendFormat()', 'Sending /api/format')

      const data2 = getConfigChanges()
      logDebug('configStore.sendFormat()', data2)

      try {
        const formats = [
          {
            key: 'http_post_format_pressure',
            data: data2.http_post_format_pressure !== undefined 
              ? { http_post_format_pressure: encodeURIComponent(data2.http_post_format_pressure) }
              : {}
          },
          {
            key: 'http_post2_format_pressure',
            data: data2.http_post2_format_pressure !== undefined 
              ? { http_post2_format_pressure: encodeURIComponent(data2.http_post2_format_pressure) }
              : {}
          },
          {
            key: 'http_get_format_pressure',
            data: data2.http_get_format_pressure !== undefined 
              ? { http_get_format_pressure: encodeURIComponent(data2.http_get_format_pressure) }
              : {}
          },
          {
            key: 'influxdb2_format_pressure',
            data: data2.influxdb2_format_pressure !== undefined 
              ? { influxdb2_format_pressure: encodeURIComponent(data2.influxdb2_format_pressure) }
              : {}
          },
          {
            key: 'mqtt_format_pressure',
            data: data2.mqtt_format_pressure !== undefined 
              ? (() => {
                  let cleaned = data2.mqtt_format_pressure.replaceAll('\n', '').replaceAll('\r', '')
                  return { mqtt_format_pressure: encodeURIComponent(cleaned) }
                })()
              : {}
          }
        ]

        let successCount = 0
        
        for (const format of formats) {
          const success = await new Promise((resolve) => {
            this.sendOneFormat(format.data, (success) => resolve(success))
          })
          
          if (success) {
            successCount++
          }
        }

        if (successCount !== 5) {
          throw new Error(`Only ${successCount}/5 formats were saved successfully`)
        }
        
      } catch (err) {
        logError('configStore.sendFormat()', err)
        throw err
      } finally {
        global.disabled = false
      }
    },
    sendOneFormat(data, callback) {
      logInfo('configStore.sendOneFormat()', 'Sending /api/format')

      if (JSON.stringify(data).length == 2) {
        logInfo('configStore.sendOneFormat()', 'No format data to store, skipping step')
        callback(true)
        return
      }

      fetch(global.baseURL + 'api/format', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: global.token
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(global.fetchTimout)
      })
        .then((res) => {
          global.disabled = false
          if (res.status != 200) {
            logError('configStore.sendOneFormat()', 'Sending /api/format failed')
            callback(false)
          } else {
            logInfo('configStore.sendOneFormat()', 'Sending /api/format completed')
            callback(true)
          }
        })
        .catch((err) => {
          logError('configStore.sendOneFormat()', err)
          callback(false)
        })
    },
    sendPushTest(data, callback) {
      global.disabled = true
      logInfo('configStore.sendPushTest()', 'Sending /api/push')
      fetch(global.baseURL + 'api/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: global.token
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(global.fetchTimout)
      })
        .then((res) => {
          if (res.status != 200) {
            logError('configStore.sendPushTest()', 'Sending /api/push failed')
            callback(false)
          } else {
            logInfo('configStore.sendPushTest()', 'Sending /api/push completed')
            callback(true)
          }
        })
        .catch((err) => {
          logError('configStore.sendPushTest()', err)
          callback(false)
        })
    },
    getPushTestStatus(callback) {
      logInfo('configStore.getPushTest()', 'Fetching /api/push/status')
      fetch(global.baseURL + 'api/push/status', {
        signal: AbortSignal.timeout(global.fetchTimout)
      })
        .then((res) => res.json())
        .then((json) => {
          logDebug('configStore.getPushTest()', json)
          logInfo('configStore.getPushTest()', 'Fetching /api/push/status completed')
          callback(true, json)
        })
        .catch((err) => {
          logError('configStore.getPushTest()', err)
          callback(false, null)
        })
    },
    sendWifiScan(callback) {
      global.disabled = true
      logInfo('configStore.sendWifiScan()', 'Sending /api/wifi')
      fetch(global.baseURL + 'api/wifi', {
        headers: { Authorization: global.token },
        signal: AbortSignal.timeout(global.fetchTimout)
      })
        .then((res) => {
          if (res.status != 200) {
            logError('configStore.sendWifiScan()', 'Sending /api/wifi failed')
            callback(false)
          } else {
            logInfo('configStore.sendWifiScan()', 'Sending /api/wifi completed')
            callback(true)
          }
        })
        .catch((err) => {
          logError('configStore.sendWifiScan()', err)
          callback(false)
        })
    },
    getWifiScanStatus(callback) {
      logInfo('configStore.getWifiScanStatus()', 'Fetching /api/wifi/status')
      fetch(global.baseURL + 'api/wifi/status', {
        method: 'GET',
        headers: { Authorization: global.token },
        signal: AbortSignal.timeout(global.fetchTimout)
      })
        .then((res) => res.json())
        .then((json) => {
          logDebug('configStore.getWifiScanStatus()', json)
          logInfo('configStore.getWifiScanStatus()', 'Fetching /api/wifi/status completed')
          callback(true, json)
        })
        .catch((err) => {
          logError('configStore.getWifiScanStatus()', err)
          callback(false, null)
        })
    },
    sendHardwareScan(callback) {
      global.disabled = true
      logInfo('configStore.sendHardwareScan()', 'Sending /api/hardware')
      fetch(global.baseURL + 'api/hardware', {
        headers: { Authorization: global.token },
        signal: AbortSignal.timeout(global.fetchTimout)
      })
        .then((res) => {
          if (res.status != 200) {
            logError('configStore.sendHardwareScan()', 'Sending /api/hardware failed')
            callback(false)
          } else {
            logInfo('configStore.sendHardwareScan()', 'Sending /api/hardware completed')
            callback(true)
          }
        })
        .catch((err) => {
          logError('configStore.sendHardwareScan()', err)
          callback(false)
        })
    },
    getHardwareScanStatus(callback) {
      logInfo('configStore.getHardwareScanStatus()', 'Fetching /api/hardware/status')
      fetch(global.baseURL + 'api/hardware/status', {
        method: 'GET',
        headers: { Authorization: global.token },
        signal: AbortSignal.timeout(global.fetchTimout)
      })
        .then((res) => res.json())
        .then((json) => {
          logDebug('configStore.getHardwareScanStatus()', json)
          logInfo('configStore.getHardwareScanStatus()', 'Fetching /api/hardware/status completed')
          callback(true, json)
        })
        .catch((err) => {
          logError('configStore.getHardwareScanStatus()', err)
          callback(false, null)
        })
    },
    saveAll() {
      this.saveAllAsync().catch(() => {
        // Error already handled in async method
      })
    },
    
    async saveAllAsync() {
      global.clearMessages()
      global.disabled = true
      
      try {
        // Send configuration first
        const configSuccess = await new Promise((resolve) => {
          this.sendConfig((success) => resolve(success))
        })
        
        if (!configSuccess) {
          throw new Error('Failed to store configuration to device')
        }
        
        // Send format templates
        const formatSuccess = await new Promise((resolve) => {
          this.sendFormat((success) => resolve(success))
        })
        
        if (!formatSuccess) {
          throw new Error('Failed to store format to device')
        }
        
        global.messageSuccess = 'Configuration has been saved to device'
        saveConfigState()
        
      } catch (error) {
        global.messageError = error.message
      } finally {
        global.disabled = false
      }
    },
    sendFilesystemRequest(data, callback) {
      global.disabled = true
      logInfo('configStore.sendFilesystemRequest()', 'Sending /api/filesystem')
      fetch(global.baseURL + 'api/filesystem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: global.token
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(global.fetchTimout)
      })
        .then((res) => res.text())
        .then((text) => {
          logDebug('configStore.sendFilesystemRequest()', text)
          callback(true, text)
        })
        .catch((err) => {
          logError('configStore.sendFilesystemRequest()', err)
          callback(false, '')
        })
    },
    // Modern async method - handles UI feedback internally via global state
    async runPushTest(data) {
      global.disabled = true
      
      try {
        // Start the push test
        const testStarted = await new Promise((resolve) => {
          this.sendPushTest(data, (success) => resolve(success))
        })
        
        if (!testStarted) {
          throw new Error('Failed to start push test')
        }
        
        // Poll for completion with proper timeout handling
        const result = await this.pollPushTestStatus()
        
        // Handle test results and update global state accordingly
        if (!result.success) {
          global.messageError = `Test failed with error code (${result.push_return_code})`
          return
        }
        
        if (!result.push_enabled) {
          global.messageWarning = 'No endpoint is defined for this target. Cannot run test.'
        } else if (!result.success && result.push_return_code > 0) {
          global.messageError = `Test failed with error code (${getErrorString(result.push_return_code)})`
        } else if (!result.success && result.push_return_code == 0) {
          global.messageError = 'Test not started. Might be blocked due to skip SSL flag enabled on esp8266'
        } else {
          global.messageSuccess = 'Test was successful'
        }
        
      } catch (error) {
        global.messageError = error.message || 'Push test failed'
        throw error
      } finally {
        global.disabled = false
      }
    },
    
    async pollPushTestStatus() {
      return new Promise((resolve, reject) => {
        const maxAttempts = 30 // 60 seconds max (30 * 2000ms)
        let attempts = 0
        
        const check = setInterval(() => {
          attempts++
          
          if (attempts > maxAttempts) {
            clearInterval(check)
            reject(new Error('Push test timeout'))
            return
          }
          
          this.getPushTestStatus((success, data) => {
            if (success) {
              if (data.status) {
                // test is still running, continue polling
              } else {
                clearInterval(check)
                resolve(data)
              }
            } else {
              clearInterval(check)
              reject(new Error('Failed to get push test status'))
            }
          })
        }, 2000)
      })
    },
    // Modern async method - keeps callback for backward compatibility
    runWifiScan(callback) {
      this.runWifiScanAsync()
        .then((data) => callback(true, data))
        .catch(() => callback(false))
    },
    
    async runWifiScanAsync() {
      global.disabled = true
      
      try {
        // Start the wifi scan
        const scanStarted = await new Promise((resolve) => {
          this.sendWifiScan((success) => resolve(success))
        })
        
        if (!scanStarted) {
          throw new Error('Failed to start wifi scan')
        }
        
        // Poll for completion with proper timeout handling
        const result = await this.pollWifiScanStatus()
        
        if (!result.success) {
          throw new Error('WiFi scan failed')
        }
        
        return result
        
      } catch (error) {
        global.messageError = error.message || 'WiFi scan failed'
        throw error
      } finally {
        global.disabled = false
      }
    },
    
    async pollWifiScanStatus() {
      return new Promise((resolve, reject) => {
        const maxAttempts = 30 // 60 seconds max (30 * 2000ms)
        let attempts = 0
        
        const check = setInterval(() => {
          attempts++
          
          if (attempts > maxAttempts) {
            clearInterval(check)
            reject(new Error('WiFi scan timeout'))
            return
          }
          
          this.getWifiScanStatus((success, data) => {
            if (success) {
              if (data.status) {
                // scan is still running, continue polling
              } else {
                clearInterval(check)
                resolve(data)
              }
            } else {
              clearInterval(check)
              reject(new Error('Failed to get wifi scan status'))
            }
          })
        }, 2000)
      })
    },
    // Modern async method - keeps callback for backward compatibility
    runHardwareScan(callback) {
      this.runHardwareScanAsync()
        .then((data) => callback(true, data))
        .catch(() => callback(false))
    },
    
    async runHardwareScanAsync() {
      global.disabled = true
      
      try {
        // Start the hardware scan
        const scanStarted = await new Promise((resolve) => {
          this.sendHardwareScan((success) => resolve(success))
        })
        
        if (!scanStarted) {
          throw new Error('Failed to start hardware scan')
        }
        
        // Poll for completion with proper timeout handling
        const result = await this.pollHardwareScanStatus()
        
        if (!result.success) {
          throw new Error('Hardware scan failed')
        }
        
        return result
        
      } catch (error) {
        global.messageError = error.message || 'Hardware scan failed'
        throw error
      } finally {
        global.disabled = false
      }
    },
    
    async pollHardwareScanStatus() {
      return new Promise((resolve, reject) => {
        const maxAttempts = 30 // 60 seconds max (30 * 2000ms)
        let attempts = 0
        
        const check = setInterval(() => {
          attempts++
          
          if (attempts > maxAttempts) {
            clearInterval(check)
            reject(new Error('Hardware scan timeout'))
            return
          }
          
          this.getHardwareScanStatus((success, data) => {
            if (success) {
              if (data.status) {
                // scan is still running, continue polling
              } else {
                clearInterval(check)
                resolve(data)
              }
            } else {
              clearInterval(check)
              reject(new Error('Failed to get hardware scan status'))
            }
          })
        }, 2000)
      })
    }
  }
})
