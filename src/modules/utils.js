import { ref } from 'vue'
import { config, global } from "@/modules/pinia"
import { logDebug, logError, logInfo } from '@/modules/logger'

export const httpHeaderOptions = ref([
  { label: 'JSON data', value: 'Content-Type: application/json' },
  { label: 'Form data', value: 'Content-Type: x-www-form-urlencoded' },
  { label: 'Authorization', value: 'Authorization: Basic {enter token here}' },
  { label: 'No Cache', value: 'Pragma: no-cache' },
  { label: 'User agent', value: 'User-Agent: gravitymon' },
])

export const httpPostUrlOptions = ref([
])

export const httpPostFormatOptions = ref([
  { label: "PressureMon", value: "" },
])

export const httpGetFormatOptions = ref([
  { label: "PressureMon", value: "" },
])

export const influxdb2FormatOptions = ref([
  { label: "PressureMon", value: "" },
])

export const mqttFormatOptions = ref([
  { label: "PressureMon", value: "" },
])

export const httpGetUrlOptions = ref([
  { label: '-blank-', value: '' },
])

export function validateCurrentForm() {
  let valid = true
  const forms = document.querySelectorAll('.needs-validation')

  Array.from(forms).forEach(form => {
    if (!form.checkValidity())
      valid = false

    form.classList.add('was-validated')
  })

  return valid
}

export function tempToF(c) {
  return (c * 1.8) + 32.0
}

export function tempToC(f) {
  return (f - 32.0) / 1.8
}

export function applyTemplate(status, config, template) {
  var s = template

  s = s.replaceAll("${temp}", status.temp)

  var c = status.temp
  var f = status.temp

  if (config.temp_unit === 'C') {
    f = tempToF(status.temp)
  } else {
    c = tempToC(status.temp)
  }

  s = s.replaceAll("${temp-c}", c)
  s = s.replaceAll("${temp-f}", f)
  s = s.replaceAll("${pressure}", status.pressure)
  s = s.replaceAll("${app-ver}", status.app_ver)
  s = s.replaceAll("${app-build}", status.app_build)
  s = s.replaceAll("${battery-percent}", 100)
  s = s.replaceAll("${rssi}", status.rssi)
  s = s.replaceAll("${run-time}", status.runtime_average)
  s = s.replaceAll("${battery}", status.battery)

  s = s.replaceAll("${pressure-psi}", status.pressure)
  s = s.replaceAll("${pressure-hpa}", convertPsiToHpa(status.pressure))
  s = s.replaceAll("${pressure-bar}", convertPsiToBar(status.pressure))

  s = s.replaceAll("${mdns}", config.mdns)
  s = s.replaceAll("${id}", config.id)
  s = s.replaceAll("${sleep-interval}", config.sleep_interval)
  s = s.replaceAll("${temp-unit}", config.temp_unit)
  s = s.replaceAll("${pressure-unit}", config.pressure_unit)

  try {
    return JSON.stringify(JSON.parse(s), null, 2)
  } catch (e) {
    logError("utils.applyTemplate()", "Not a valid json document, returning string")
  }

  return s
}

export function convertPsiToHpa(p) {
  return p * 68.9476
}

export function convertPsiToBar(p) {
  return p == 0 ? 0 : p / 14.5038
}

export function isValidJson(s) {
  try {
    JSON.stringify(JSON.parse(s))
    return true
  } catch (e) {
  }

  return false
}

export function isValidFormData(s) {
  if (s.startsWith('?'))
    return true

  return false
}

export function isValidMqttData(s) {
  if (s.indexOf('|') >= 0)
    return true

  return false
}

export function getErrorString(code) {
  switch (code) {
    case -100: return "Skipped since SSL is used"
    case 200: return "Success (200)"
    case 401: return "Access denied (401)"
    case 404: return "Endpoint not found (404)"
    case 422: return "Paylod cannot be parsed, check format and http headers"
  }

  return "Unknown code, check documentation (" + code + ")"
}

export function isSensorCalibrated() {
  if(config.pressure_zero_correction == 0.0)
    return false

  return true
}

export function restart() {
  global.clearMessages()
  global.disabled = true
  fetch(global.baseURL + 'api/restart', { 
      headers: { "Authorization": global.token }, 
      signal: AbortSignal.timeout(global.fetchTimout),
  })
      .then(res => res.json())
      .then(json => {
          logDebug("utils.restart()", json)
          if (json.status == true) {
              global.messageSuccess = json.message + " Redirecting to http://" + config.mdns + ".local in 8 seconds."
              logInfo("utils.restart()", "Scheduling refresh of UI")
              setTimeout(() => { location.href = "http://" + config.mdns + ".local" }, 8000)
          } else {
              global.messageError = json.message
              global.disabled = false
          }
      })
      .catch(err => {
          logError("utils.restart()", err)
          global.messageError = "Failed to do restart"
          global.disabled = false
      })
}