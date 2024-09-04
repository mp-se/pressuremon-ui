<template>
  <div class="container">
    <p></p>
    <p class="h3">Device - Hardware</p>
    <hr />

    <BsMessage v-if="!isSensorCalibrated()" dismissable="true" message="" alert="warning">
      You need to calibrate pressure sensor
    </BsMessage>

    <form @submit.prevent="save" class="needs-validation" novalidate>
      <div class="row">
        <div class="col-md-6">
          <BsSelect
            v-model="config.pressure_sensor_type"
            :options="sensorOptions"
            label="Pressure sensor"
            width=""
            :disabled="global.disabled"
          ></BsSelect>
        </div>

        <div class="col-md-6">
          <BsInputReadonly
            v-model="config.pressure_zero_correction"
            label="Pressure Zero Correction"
            help="The correction value for the pressure sensor"
            :disabled="global.disabled"
          ></BsInputReadonly>
        </div>

        <!--
                <div class="col-md-6">
                    <BsInputNumber v-model="config.voltage_factor" label="Voltage factor" min="0" max="6" step=".01"
                        width="4" :unit="voltage"
                        help="Factor used to calculate the battery voltage. Can vary depending on the R2 value (0 to 6)"
                        :disabled="global.disabled">
                    </BsInputNumber>
                </div>
                -->
      </div>
      <div class="row gy-2">
        <div class="col-md-12">
          <hr />
        </div>
        <div class="col-md-3">
          <button
            type="submit"
            class="btn btn-primary w-2"
            :disabled="global.disabled || !global.configChanged"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Save
          </button>
        </div>
        <div class="col-md-3">
          <button
            @click="restart()"
            type="button"
            class="btn btn-secondary"
            :disabled="global.disabled"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Restart device
          </button>
        </div>
        <div class="col-md-3">
          <button
            @click="calibrate"
            type="button"
            class="btn btn-secondary"
            :disabled="global.disabled"
          >
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              :hidden="!global.disabled"
            ></span>
            &nbsp;Calibrate sensor&nbsp;<span
              v-if="badge.deviceCalibratedBadge()"
              class="badge text-bg-danger rounded-circle"
              >1</span
            >
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { isSensorCalibrated, validateCurrentForm, restart } from '@/modules/utils'
import { global, config } from '@/modules/pinia'
import * as badge from '@/modules/badge'
import { logDebug, logError, logInfo } from '@/modules/logger'

const sensorOptions = ref([
  { label: 'Honeywell ABP Gauge SPI 0-30 psi', value: 0 },
  { label: 'Honeywell ABP Gauge SPI 0-60 psi', value: 1 },
  { label: 'Honeywell ABP Gauge SPI 0-100 psi', value: 2 },
  { label: 'Honeywell ABP Gauge SPI 0-150 psi', value: 3 }
])

const calibrate = () => {
  global.disabled = true
  logInfo('DeviceHardwareView.calibrate()', 'Sending /api/calibrate')
  fetch(global.baseURL + 'api/calibrate', {
    headers: { Authorization: global.token },
    signal: AbortSignal.timeout(global.fetchTimout)
  })
    .then((res) => {
      if (res.status != 200) {
        global.messageError = 'Failed to calibrate device'
      } else {
        setTimeout(() => {
          fetch(global.baseURL + 'api/calibrate/status', {
            headers: { Authorization: global.token },
            signal: AbortSignal.timeout(global.fetchTimout)
          })
            .then((res) => {
              logDebug('DeviceHardwareView.calibrate()', res)
              if (res.status != 200 || res.success == true) {
                global.messageError = 'Failed to get calibration status'
              } else {
                config.load((success) => {
                  if (success) {
                    global.messageSuccess = 'Sensor calibrated'
                  } else {
                    global.messageError = 'Failed to load configuration'
                  }
                  global.disabled = false
                })
              }
            })
            .catch((err) => {
              global.messageError = 'Failed to get calibration status'
              logError('DeviceHardwareView.calibrate()', err)
            })
        }, 4000)
      }
    })
    .catch((err) => {
      global.messageError = 'Failed to send calibrate request'
      logError('DeviceHardwareView.calibrate()', err)
    })
}

const save = () => {
  if (!validateCurrentForm()) return

  global.clearMessages()
  config.saveAll()
}
</script>
