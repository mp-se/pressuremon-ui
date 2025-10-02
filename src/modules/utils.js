import { ref } from 'vue'
import { config, global } from '@/modules/pinia'
import { logDebug, logError, logInfo } from '@/modules/logger'

export const httpHeaderOptions = ref([
  { label: 'JSON data', value: 'Content-Type: application/json' },
  { label: 'Form data', value: 'Content-Type: x-www-form-urlencoded' },
  { label: 'Authorization', value: 'Authorization: Basic {enter token here}' },
  { label: 'No Cache', value: 'Pragma: no-cache' },
  { label: 'User agent', value: 'User-Agent: gravitymon' }
])

export const httpPostUrlOptions = ref([
  {
    label: '-- none --',
    value: ''
  }
  /*
  {
    label: 'Brewfather ispindel',
    value: 'http://log.brewfather.net/ispindel?id=<yourid>'
  },
  {
    label: 'Brewfather stream',
    value: 'http://log.brewfather.net/stream?id=<yourid>'
  },
  {
    label: 'UBI dots',
    value: 'http://industrial.api.ubidots.com/api/v1.6/devices/<devicename>/?token=<api-token>'
  },
  {
    label: 'UBI dots secure',
    value: 'https://industrial.api.ubidots.com/api/v1.6/devices/<devicename>/?token=<api-token>'
  },
  {
    label: 'Brewersfriend (P)',
    value: 'http://log.brewersfriend.com/ispindel/[API KEY]'
  },
  {
    label: 'Brewersfriend (SG)',
    value: 'http://log.brewersfriend.com/ispindel_sg/[API KEY]'
  },
  { label: 'Brewspy', value: 'http://brew-spy.com/api/ispindel' },
  { label: 'Thingsspeak', value: 'http://api.thingspeak.com/update.json' },
  { label: 'Blynk', value: 'http://blynk.cloud/external/api/batch/update' },
  { label: 'Bierdot bricks', value: 'https://brewbricks.com/api/iot/v1' }
*/
])

export const httpPostFormatOptions = ref([
  {
    label: '-- none --',
    value: ''
  },
  {
    label: 'Pressuremon (Single)',
    value:
      '%7B%22name%22%3A%20%22%24%7Bmdns%7D%22%2C%20%22id%22%3A%20%22%24%7Bid%7D%22%2C%20%22token%22%3A%20%22%24%7Btoken%7D%22%2C%20%22interval%22%3A%20%24%7Bsleep%2Dinterval%7D%2C%20%22temperature%22%3A%20%24%7Btemp%7D%2C%20%22temperature%2Dunit%22%3A%20%22%24%7Btemp%2Dunit%7D%22%2C%20%22pressure%22%3A%20%24%7Bpressure%7D%2C%20%22pressure%2Dunit%22%3A%20%22%24%7Bpressure%2Dunit%7D%22%2C%20%22battery%22%3A%20%24%7Bbattery%7D%2C%20%22rssi%22%3A%20%24%7Brssi%7D%2C%20%22run%2Dtime%22%3A%20%24%7Brun%2Dtime%7D%20%7D'
  },
  {
    label: 'Pressuremon (Dual)',
    value:
      '%7B%22name%22%3A%20%22%24%7Bmdns%7D%22%2C%20%22id%22%3A%20%22%24%7Bid%7D%22%2C%20%22token%22%3A%20%22%24%7Btoken%7D%22%2C%20%22interval%22%3A%20%24%7Bsleep-interval%7D%2C%20%22temperature%22%3A%20%24%7Btemp%7D%2C%20%22temperature-unit%22%3A%20%22%24%7Btemp-unit%7D%22%2C%20%22pressure%22%3A%20%24%7Bpressure%7D%2C%20%22pressure1%22%3A%20%24%7Bpressure1%7D%2C%20%22pressure-unit%22%3A%20%22%24%7Bpressure-unit%7D%22%2C%20%22battery%22%3A%20%24%7Bbattery%7D%2C%20%22rssi%22%3A%20%24%7Brssi%7D%2C%20%22run-time%22%3A%20%24%7Brun-time%7D%20%7D'
  }
])

export const httpGetFormatOptions = ref([
  {
    label: '-- none --',
    value: ''
  },
  {
    label: 'Pressuremon (Single)',
    value:
      '%3Fname%3D%24%7Bmdns%7D%26id%3D%24%7Bid%7D%26token%3D%24%7Btoken2%7D%26interval%3D%24%7Bsleep%2Dinterval%7D%26temperature%3D%24%7Btemp%7D%26temperature%2Dunit%3D%24%7Btemp%2Dunit%7D%26pressure%3D%24%7Bpressure%7D%26pressure%2Dunit%3D%24%7Bpressure%2Dunit%7D%26battery%3D%24%7Bbattery%7D%26rssi%3D%24%7Brssi%7D%26run%2Dtime%3D%24%7Brun%2Dtime%7D'
  },
  {
    label: 'Pressuremon (Dual)',
    value:
      '%3Fname%3D%24%7Bmdns%7D%26id%3D%24%7Bid%7D%26token%3D%24%7Btoken2%7D%26interval%3D%24%7Bsleep-interval%7D%26temperature%3D%24%7Btemp%7D%26temperature-unit%3D%24%7Btemp-unit%7D%26pressure%3D%24%7Bpressure%7D%26pressure1%3D%24%7Bpressure1%7D%26pressure-unit%3D%24%7Bpressure-unit%7D%26battery%3D%24%7Bbattery%7D%26rssi%3D%24%7Brssi%7D%26run-time%3D%24%7Brun-time%7D'
  }
])

export const influxdb2FormatOptions = ref([
  {
    label: '-- none --',
    value: ''
  },
  {
    label: 'Pressuremon (Single)',
    value:
      'measurement%2Chost%3D%24%7Bmdns%7D%2Cdevice%3D%24%7Bid%7D%2Ctemperature%2Dunit%3D%24%7Btemp%2Dunit%7D%2Cpressure%2Dunit%3D%24%7Bpressure%2Dunit%7D%20pressure%3D%24%7Bpressure%7D%2Ctemp%3D%24%7Btemp%7D%2Cbattery%3D%24%7Bbattery%7D%2Crssi%3D%24%7Brssi%7D%0A'
  },
  {
    label: 'Pressuremon (Dual)',
    value:
      'measurement%2Chost%3D%24%7Bmdns%7D%2Cdevice%3D%24%7Bid%7D%2Ctemperature-unit%3D%24%7Btemp-unit%7D%2Cpressure-unit%3D%24%7Bpressure-unit%7D%20pressure%3D%24%7Bpressure%7D%2Cpressure1%3D%24%7Bpressure1%7D%2Ctemp%3D%24%7Btemp%7D%2Cbattery%3D%24%7Bbattery%7D%2Crssi%3D%24%7Brssi%7D%0A'
  }
])

export const mqttFormatOptions = ref([
  {
    label: '-- none --',
    value: ''
  },
  {
    label: 'Pressuremon (Single)',
    value:
      'pressuremon%2F%24%7Bmdns%7D%2Ftemperature%3A%24%7Btemp%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Ftemperature%2Dunit%3A%24%7Btemp%2Dunit%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Fbattery%3A%24%7Bbattery%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Fpressure%3A%24%7Bpressure%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Fpressure%2Dunit%3A%24%7Bpressure%2Dunit%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Finterval%3A%24%7Bsleep%2Dinterval%7D%7Cpressuremon%2F%24%7Bmdns%7D%2FRSSI%3A%24%7Brssi%7D%7C'
  },
  {
    label: 'Pressuremon (Dual)',
    value:
      'pressuremon%2F%24%7Bmdns%7D%2Ftemperature%3A%24%7Btemp%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Ftemperature-unit%3A%24%7Btemp-unit%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Fbattery%3A%24%7Bbattery%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Fpressure%3A%24%7Bpressure%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Fpressure1%3A%24%7Bpressure1%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Fpressure-unit%3A%24%7Bpressure-unit%7D%7Cpressuremon%2F%24%7Bmdns%7D%2Finterval%3A%24%7Bsleep-interval%7D%7Cpressuremon%2F%24%7Bmdns%7D%2FRSSI%3A%24%7Brssi%7D%7C'
  },
  {
    label: 'Brewblox (Single)',
    value:
      'brewcast%2Fhistory%2Fpressuremon%3A%20%7B%22key%22%3A%20%22%24%7Bmdns%7D%22%2C%20%22data%22%3A%20%7B%22pressure%22%3A%20%24%7Bpressure%7D%2C%20%22pressure-unit%22%3A%20%22%24%7Bpressure-unit%7D%22%2C%20%22battery%22%3A%24%7Bbattery%7D%2C%20%22interval%22%3A%20%24%7Bsleep-interval%7D%2C%20%22RSSI%22%3A%20%24%7Brssi%7D%7D%7D%7C'
  },
  {
    label: 'Brewblox (Dual)',
    value:
      'brewcast%2Fhistory%2Fpressuremon%3A%20%7B%22key%22%3A%20%22%24%7Bmdns%7D%22%2C%20%22data%22%3A%20%7B%22pressure%22%3A%20%24%7Bpressure%7D%2C%20%22pressure1%22%3A%20%24%7Bpressure1%7D%2C%20%22pressure-unit%22%3A%20%22%24%7Bpressure-unit%7D%22%2C%20%22battery%22%3A%24%7Bbattery%7D%2C%20%22interval%22%3A%20%24%7Bsleep-interval%7D%2C%20%22RSSI%22%3A%20%24%7Brssi%7D%7D%7D%7C'
  }
])

export const httpGetUrlOptions = ref([{ label: '-blank-', value: '' }])

export function validateCurrentForm() {
  let valid = true
  const forms = document.querySelectorAll('.needs-validation')

  Array.from(forms).forEach((form) => {
    if (!form.checkValidity()) valid = false

    form.classList.add('was-validated')
  })

  return valid
}

export function roundVal(val, decimals) {
  return parseFloat(Number(val).toFixed(decimals))
}

export function tempToF(c) {
  return c * 1.8 + 32.0
}

export function tempToC(f) {
  return (f - 32.0) / 1.8
}

export function psiToBar(p) {
  return p * 0.0689475729
}

export function psiToKPa(p) {
  return p * 68.947572932 * 1000
}

export function barToPsi(p) {
  return p
}

export function kpaToPsi(p) {
  return p
}

export function applyTemplate(status, config, template) {
  var s = template

  s = s.replaceAll('${temp}', status.temp)

  var c = status.temp
  var f = status.temp

  if (config.temp_unit === 'C') {
    f = tempToF(status.temp)
  } else {
    c = tempToC(status.temp)
  }

  s = s.replaceAll('${temp-c}', c)
  s = s.replaceAll('${temp-f}', f)

  // NOTE: Pressure handling
  let p = status.pressure

  if (status.isKPa) {
    p = kpaToPsi(p)
  } else if (status.isBar) {
    p = barToPsi(p)
  }

  s = s.replaceAll('${pressure}', p)
  s = s.replaceAll('${pressure-psi}', p)
  s = s.replaceAll('${pressure-bar}', psiToBar(p))
  s = s.replaceAll('${pressure-kpa}', psiToKPa(p))

  let p1 = status.pressure1

  if (status.isKPa) {
    p1 = kpaToPsi(p1)
  } else if (status.isBar) {
    p1 = barToPsi(p1)
  }

  s = s.replaceAll('${pressure1}', p1)
  s = s.replaceAll('${pressure1-psi}', p1)
  s = s.replaceAll('${pressure1-bar}', psiToBar(p1))
  s = s.replaceAll('${pressure1-kpa}', psiToKPa(p1))

  s = s.replaceAll('${run-time}', 1.5)
  s = s.replaceAll('${app-ver}', global.app_ver)
  s = s.replaceAll('${app-build}', global.app_build)
  s = s.replaceAll('${battery-percent}', 100)
  s = s.replaceAll('${rssi}', status.rssi)
  s = s.replaceAll('${run-time}', status.runtime_average)
  s = s.replaceAll('${corr-gravity}', status.gravity)
  s = s.replaceAll('${battery}', status.battery)

  s = s.replaceAll('${mdns}', config.mdns)
  s = s.replaceAll('${id}', config.id)
  s = s.replaceAll('${sleep-interval}', config.sleep_interval)
  s = s.replaceAll('${token}', config.token)
  s = s.replaceAll('${token2}', config.token2)
  s = s.replaceAll('${temp-unit}', config.temp_unit)
  s = s.replaceAll('${pressure-unit}', config.pressure_unit)

  try {
    return JSON.stringify(JSON.parse(s), null, 2)
  } catch {
    logError('utils.applyTemplate()', 'Not a valid json document, returning string')
  }

  return s
}

export function isValidJson(s) {
  try {
    JSON.stringify(JSON.parse(s))
    return true
  } catch (e) {
    logDebug('utils.isValidJson()', e)
  }

  return false
}

export function isValidFormData(s) {
  if (s.startsWith('?')) return true

  return false
}

export function isValidMqttData(s) {
  if (s.indexOf('|') >= 0) return true

  return false
}

export function getErrorString(code) {
  switch (code) {
    case -100:
      return 'Skipped since SSL is used'
    case 200:
      return 'Success (200)'
    case 401:
      return 'Access denied (401)'
    case 404:
      return 'Endpoint not found (404)'
    case 422:
      return 'Paylod cannot be parsed, check format and http headers'
  }

  return ''
}

export function restart() {
  global.clearMessages()
  global.disabled = true
  fetch(global.baseURL + 'api/restart', {
    headers: { Authorization: global.token },
    signal: AbortSignal.timeout(global.fetchTimout)
  })
    .then((res) => res.json())
    .then((json) => {
      logDebug('utils.restart()', json)
      if (json.status == true) {
        global.messageSuccess =
          json.message + ' Redirecting to http://' + config.mdns + '.local in 8 seconds.'
        logInfo('utils.restart()', 'Scheduling refresh of UI')
        setTimeout(() => {
          location.href = 'http://' + config.mdns + '.local'
        }, 8000)
      } else {
        global.messageError = json.message
        global.disabled = false
      }
    })
    .catch((err) => {
      logError('utils.restart()', err)
      global.messageError = 'Failed to do restart'
      global.disabled = false
    })
}
