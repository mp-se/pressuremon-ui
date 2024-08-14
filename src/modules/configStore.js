import { defineStore } from 'pinia'
import { global, saveConfigState, getConfigChanges } from '@/modules/pinia'
import { getErrorString } from '@/modules/utils'
import { logDebug, logError, logInfo } from '@/modules/logger'

export const useConfigStore = defineStore('config', {
    state: () => {
        return {
            // Device
            id: "",
            mdns: "",
            temp_unit: "",
            pressure_unit: "",
            // Hardware
            pressure_zero_correction: 0,
            pressure_sensor_type: 0,
            voltage_factor: 0,
            voltage_factor: 0,
            // Wifi
            wifi_portal_timeout: 0,
            wifi_connect_timeout: 0,
            wifi_ssid: "",
            wifi_ssid2: "",
            wifi_pass: "",
            wifi_pass2: "",
            wifi_direct_ssid: "",
            wifi_direct_pass: "",
            use_wifi_direct: false,
            // Push - Generic
            sleep_interval: 0,
            push_timeout: 0,
            // Push - Http Post 1
            http_post_target: "",
            http_post_header1: "",
            http_post_header2: "",
            http_post_format: "",
            // Push - Http Post 2
            http_post2_target: "",
            http_post2_header1: "",
            http_post2_header2: "",
            http_post2_format: "",
            // Push - Http Get
            http_get_target: "",
            http_get_header1: "",
            http_get_header2: "",
            http_get_format: "",
            // Push - Influx
            influxdb2_target: "",
            influxdb2_org: "",
            influxdb2_bucket: "",
            influxdb2_token: "",
            influxdb2_format: "",
            // Push - MQTT
            mqtt_target: "",
            //mqtt_push: "",
            mqtt_port: "",
            mqtt_user: "",
            mqtt_pass: "",
            mqtt_format: "",
            // Push BLE
            ble_format: 0,
            // Gravity formula
            dark_mode: false,
        }
    },
    actions: {
        toJson() {
            logInfo("configStore.toJSON()")
            var dest = {}

            for (var key in this.$state) {
                if (!key.startsWith("$")) {
                    if (key === "gyro_calibration_data") {
                        dest[key] = []
                        for (var i in this.$state[key]) {
                            dest[key][i] = this.$state[key][i]
                        }
                    } else if (key === "formula_calculation_data") {
                        dest[key] = []
                        for (var i in this.$state[key]) {
                            dest[key][i] = {}
                            dest[key][i].a = this.$state[key][i].a
                            dest[key][i].g = this.$state[key][i].g
                        }
                    } else {
                        dest[key] = this[key]
                    }
                }
            }

            logInfo("configStore.toJSON()", dest)
            return JSON.stringify(dest, null, 2)
        },
        load(callback) {
            global.disabled = true
            logInfo("configStore.load()", "Fetching /api/config")
            fetch(global.baseURL + 'api/config', {
                method: "GET",
                headers: { "Authorization": global.token },
                signal: AbortSignal.timeout(global.fetchTimout),
            })
                .then(res => res.json())
                .then(json => {
                    logDebug("configStore.load()", json)
                    global.disabled = false
                    this.id = json.id
                    // Device
                    this.mdns = json.mdns
                    this.temp_unit = json.temp_unit
                    this.pressure_unit = json.pressure_unit
                    // Hardware
                    this.pressure_zero_correction = json.pressure_zero_correction
                    this.pressure_sensor_type = json.pressure_sensor_type
                    this.voltage_factor = json.voltage_factor
                    // Wifi
                    this.wifi_portal_timeout = json.wifi_portal_timeout
                    this.wifi_connect_timeout = json.wifi_connect_timeout
                    this.wifi_ssid = json.wifi_ssid
                    this.wifi_ssid2 = json.wifi_ssid2
                    this.wifi_pass = json.wifi_pass
                    this.wifi_pass2 = json.wifi_pass2
                    //this.wifi_direct_ssid = json.wifi_direct_ssid
                    //this.wifi_direct_pass = json.wifi_direct_pass
                    //this.use_wifi_direct = json.use_wifi_direct
                    // Push - Generic
                    this.sleep_interval = json.sleep_interval
                    this.push_timeout = json.push_timeout
                    // Push - Http Post 1
                    this.http_post_target = json.http_post_target
                    this.http_post_header1 = json.http_post_header1
                    this.http_post_header2 = json.http_post_header2
                    this.http_post_format = json.http_post_format
                    // Push - Http Post 2
                    this.http_post2_target = json.http_post2_target
                    this.http_post2_header1 = json.http_post2_header1
                    this.http_post2_header2 = json.http_post2_header2
                    this.http_post2_format = json.http_post2_format
                    // Push - Http Get
                    this.http_get_target = json.http_get_target
                    this.http_get_header1 = json.http_get_header1
                    this.http_get_header2 = json.http_get_header2
                    this.http_get_format = json.http_get_format
                    // Push - Influx
                    this.influxdb2_target = json.influxdb2_target
                    this.influxdb2_org = json.influxdb2_org
                    this.influxdb2_bucket = json.influxdb2_bucket
                    this.influxdb2_token = json.influxdb2_token
                    this.influxdb2_format = json.influxdb2_format
                    // Push - MQTT
                    this.mqtt_target = json.mqtt_target
                    this.mqtt_port = json.mqtt_port
                    this.mqtt_user = json.mqtt_user
                    this.mqtt_pass = json.mqtt_pass
                    this.mqtt_format = json.mqtt_format
                    // Push BLE
                    //this.ble_format = json.ble_format
                    this.dark_mode = json.dark_mode
                    callback(true)
                })
                .catch(err => {
                    global.disabled = false
                    logError("configStore.load()", err)
                    callback(false)
                })
        },
        loadFormat(callback) {
            global.disabled = true
            logInfo("configStore.loadFormat()", "Fetching /api/format")
            fetch(global.baseURL + 'api/format', {
                method: "GET",
                headers: { "Authorization": global.token },
                signal: AbortSignal.timeout(global.fetchTimout),
            })
                .then(res => res.json())
                .then(json => {
                    logDebug("configStore.loadFormat()", json)
                    global.disabled = false
                    this.http_post_format = decodeURIComponent(json.http_post_format)
                    this.http_post2_format = decodeURIComponent(json.http_post2_format)
                    this.http_get_format = decodeURIComponent(json.http_get_format)
                    this.influxdb2_format = decodeURIComponent(json.influxdb2_format)
                    this.mqtt_format = decodeURIComponent(json.mqtt_format)

                    // Add linebreaks so the editor shows the data correctly
                    this.mqtt_format = this.mqtt_format.replaceAll("|", "|\n")
                    callback(true)
                })
                .catch(err => {
                    global.disabled = false
                    logError("configStore.loadFormat()", err)
                    callback(false)
                })
        },
        sendConfig(callback) {
            global.disabled = true
            logInfo("configStore.sendConfig()", "Sending /api/config")

            var data = getConfigChanges()
            delete data.http_post_format
            delete data.http_post2_format
            delete data.http_get_format
            delete data.influxdb2_format
            delete data.mqtt_format
            logDebug("configStore.sendConfig()", data)

            if (JSON.stringify(data).length == 2) {
                logInfo("configStore.sendConfig()", "No config data to store, skipping step")
                global.disabled = false
                callback(true)
                return
            }

            fetch(global.baseURL + 'api/config', {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": global.token },
                body: JSON.stringify(data),
                signal: AbortSignal.timeout(global.fetchTimout),
            })
                .then(res => {
                    global.disabled = false
                    if (res.status != 200) {
                        logError("configStore.sendConfig()", "Sending /api/config failed", res.status)
                        callback(false)
                    }
                    else {
                        logInfo("configStore.sendConfig()", "Sending /api/config completed")
                        callback(true)
                    }
                })
                .catch(err => {
                    logError("configStore.sendConfig()", err)
                    callback(false)
                    global.disabled = false
                })
        },
        sendFormat(callback) {
            global.disabled = true
            logInfo("configStore.sendFormat()", "Sending /api/format")

            var data2 = getConfigChanges()
            var data = {}
            var cnt = 0

            logDebug("configStore.sendFormat()", data)

            data = data2.http_post_format !== undefined ? { http_post_format: encodeURIComponent(data2.http_post_format) } : {}
            this.sendOneFormat(data, (success) => {
                if (success) cnt += 1
                data = data2.http_post2_format !== undefined ? { http_post2_format: encodeURIComponent(data2.http_post2_format) } : {}
                this.sendOneFormat(data, (success) => {
                    if (success) cnt += 1
                    data = data2.http_get_format !== undefined ? { http_get_format: encodeURIComponent(data2.http_get_format) } : {}
                    this.sendOneFormat(data, (success) => {
                        if (success) cnt += 1
                        data = data2.influxdb2_format !== undefined ? { influxdb2_format: encodeURIComponent(data2.influxdb2_format) } : {}
                        this.sendOneFormat(data, (success) => {
                            if (success) cnt += 1

                            if (data2.mqtt_format !== undefined) {
                                data2.mqtt_format = data2.mqtt_format.replaceAll("\n", "")
                                data2.mqtt_format = data2.mqtt_format.replaceAll("\r", "")
                            }

                            data = data2.mqtt_format !== undefined ? { mqtt_format: encodeURIComponent(data2.mqtt_format) } : {}
                            this.sendOneFormat(data, (success) => {
                                if (success) cnt += 1

                                if (cnt == 5)
                                    callback(true)
                                else
                                    callback(false)
                            })
                        })
                    })
                })
            })
        },
        sendOneFormat(data, callback) {
            logInfo("configStore.sendOneFormat()", "Sending /api/format")

            if (JSON.stringify(data).length == 2) {
                logInfo("configStore.sendOneFormat()", "No format data to store, skipping step")
                callback(true)
                return
            }

            fetch(global.baseURL + 'api/format', {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": global.token },
                body: JSON.stringify(data),
                signal: AbortSignal.timeout(global.fetchTimout),
            })
                .then(res => {
                    global.disabled = false
                    if (res.status != 200) {
                        logError("configStore.sendOneFormat()", "Sending /api/format failed")
                        callback(false)
                    } else {
                        logInfo("configStore.sendOneFormat()", "Sending /api/format completed")
                        callback(true)
                    }
                })
                .catch(err => {
                    logError("configStore.sendOneFormat()", err)
                    callback(false)
                })
        },
        sendPushTest(data, callback) {
            global.disabled = true
            logInfo("configStore.sendPushTest()", "Sending /api/push")
            fetch(global.baseURL + 'api/push', {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": global.token },
                body: JSON.stringify(data),
                signal: AbortSignal.timeout(global.fetchTimout),
            })
                .then(res => {
                    if (res.status != 200) {
                        logError("configStore.sendPushTest()", "Sending /api/push failed")
                        callback(false)
                    } else {
                        logInfo("configStore.sendPushTest()", "Sending /api/push completed")
                        callback(true)
                    }
                })
                .catch(err => {
                    logError("configStore.sendPushTest()", err)
                    callback(false)
                })
        },
        getPushTestStatus(callback) {
            logInfo("configStore.getPushTest()", "Fetching /api/push/status")
            fetch(global.baseURL + 'api/push/status', {
                signal: AbortSignal.timeout(global.fetchTimout),
            })
                .then(res => res.json())
                .then(json => {
                    logDebug("configStore.getPushTest()", json)
                    logInfo("configStore.getPushTest()", "Fetching /api/push/status completed")
                    callback(true, json)
                })
                .catch(err => {
                    logError("configStore.getPushTest()", err)
                    callback(false, null)
                })
        },
        sendWifiScan(callback) {
            global.disabled = true
            logInfo("configStore.sendWifiScan()", "Sending /api/wifi")
            fetch(global.baseURL + 'api/wifi', {
                headers: { "Authorization": global.token },
                signal: AbortSignal.timeout(global.fetchTimout),
            })
                .then(res => {
                    if (res.status != 200) {
                        logError("configStore.sendWifiScan()", "Sending /api/wifi failed")
                        callback(false)
                    } else {
                        logInfo("configStore.sendWifiScan()", "Sending /api/wifi completed")
                        callback(true)
                    }
                })
                .catch(err => {
                    logError("configStore.sendWifiScan()", err)
                    callback(false)
                })
        },
        getWifiScanStatus(callback) {
            logInfo("configStore.getWifiScanStatus()", "Fetching /api/wifi/status")
            fetch(global.baseURL + 'api/wifi/status', {
                method: "GET",
                headers: { "Authorization": global.token },
                signal: AbortSignal.timeout(global.fetchTimout),
            })
                .then(res => res.json())
                .then(json => {
                    logDebug("configStore.getWifiScanStatus()", json)
                    logInfo("configStore.getWifiScanStatus()", "Fetching /api/wifi/status completed")
                    callback(true, json)
                })
                .catch(err => {
                    logError("configStore.getWifiScanStatus()", err)
                    callback(false, null)
                })
        },
        sendHardwareScan(callback) {
            global.disabled = true
            logInfo("configStore.sendHardwareScan()", "Sending /api/hardware")
            fetch(global.baseURL + 'api/hardware', {
                headers: { "Authorization": global.token },
                signal: AbortSignal.timeout(global.fetchTimout),
            })
                .then(res => {
                    if (res.status != 200) {
                        logError("configStore.sendHardwareScan()", "Sending /api/hardware failed")
                        callback(false)
                    } else {
                        logInfo("configStore.sendHardwareScan()", "Sending /api/hardware completed")
                        callback(true)
                    }
                })
                .catch(err => {
                    logError("configStore.sendHardwareScan()", err)
                    callback(false)
                })
        },
        getHardwareScanStatus(callback) {
            logInfo("configStore.getHardwareScanStatus()", "Fetching /api/hardware/status")
            fetch(global.baseURL + 'api/hardware/status', {
                method: "GET",
                headers: { "Authorization": global.token },
                signal: AbortSignal.timeout(global.fetchTimout),
            })
                .then(res => res.json())
                .then(json => {
                    logDebug("configStore.getHardwareScanStatus()", json)
                    logInfo("configStore.getHardwareScanStatus()", "Fetching /api/hardware/status completed")
                    callback(true, json)
                })
                .catch(err => {
                    logError("configStore.getHardwareScanStatus()", err)
                    callback(false, null)
                })
        },
        saveAll() {
            global.clearMessages()
            global.disabled = true
            this.sendConfig((success) => {
                if (!success) {
                    global.disabled = false
                    global.messageError = "Failed to store configuration to device"
                } else {
                    this.sendFormat((success) => {
                        global.disabled = false
                        if (!success) {
                            global.messageError = "Failed to store format to device"
                        } else {
                            global.messageSuccess = "Configuration has been saved to device"
                            saveConfigState()
                        }
                    })
                }
            })
        },
        sendFilesystemRequest(data, callback) {
            global.disabled = true
            logInfo("configStore.sendFilesystemRequest()", "Sending /api/filesystem")
            fetch(global.baseURL + 'api/filesystem', {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": global.token },
                body: JSON.stringify(data),
                signal: AbortSignal.timeout(global.fetchTimout),
            })
                .then(res => res.text())
                .then(text => {
                    logDebug("configStore.sendFilesystemRequest()", text)
                    callback(true, text)
                })
                .catch(err => {
                    logError("configStore.sendFilesystemRequest()", err)
                    callback(false, "")
                })
        },
        runPushTest(data, callback) {
            global.disabled = true
            this.sendPushTest(data, (success) => {
                if (success) {
                    var check = setInterval(() => {
                        this.getPushTestStatus((success, data) => {
                            if (success) {
                                if (data.status) {
                                    // test is still running, just wait for next check
                                } else {
                                    global.disabled = false
                                    if (!data.push_enabled) {
                                        global.messageWarning = "No endpoint is defined for this target. Cannot run test."
                                    } else if (!data.success) {
                                        global.messageError = "Test failed with error code " + getErrorString(data.last_error)
                                    } else {
                                        global.messageSuccess = "Test was successful"
                                    }

                                    callback(true)
                                    clearInterval(check)
                                }
                            } else {
                                global.disabled = false
                                global.messageError = "Failed to get push test status"
                                callback(false)
                                clearInterval(check)
                            }
                        })
                    }, 2000)
                } else {
                    global.messageError = "Failed to start push test"
                    global.disabled = false
                    callback(false)
                }
            })
        },
        runWifiScan(callback) {
            global.disabled = true
            this.sendWifiScan((success) => {
                if (success) {
                    var check = setInterval(() => {
                        this.getWifiScanStatus((success, data) => {
                            if (success) {
                                if (data.status) {
                                    // test is still running, just wait for next check
                                } else {
                                    global.disabled = false
                                    callback(data.success, data)
                                    clearInterval(check)
                                }
                            } else {
                                global.disabled = false
                                global.messageError = "Failed to get wifi scan status"
                                callback(false)
                                clearInterval(check)
                            }
                        })
                    }, 2000)
                } else {
                    global.disabled = false
                    global.messageError = "Failed to start wifi scan"
                    callback(false)
                }
            })
        },
        runHardwareScan(callback) {
            global.disabled = true
            this.sendHardwareScan((success) => {
                if (success) {
                    var check = setInterval(() => {
                        this.getHardwareScanStatus((success, data) => {
                            if (success) {
                                if (data.status) {
                                    // test is still running, just wait for next check
                                } else {
                                    global.disabled = false
                                    callback(data.success, data)
                                    clearInterval(check)
                                }
                            } else {
                                global.disabled = false
                                global.messageError = "Failed to get hardware scan status"
                                callback(false)
                                clearInterval(check)
                            }
                        })
                    }, 2000)
                } else {
                    global.disabled = false
                    global.messageError = "Failed to start hardware scan"
                    callback(false)
                }
            })
        }
    },
})