<template>
  <div class="container">
    <p></p>
    <p class="h3">Backup & Restore</p>
    <hr>

    <div class="row">
      <div class="col-md-12">
        <p>Create a backup of the device configuration and store this in a textfile</p>
      </div>

      <div class="col-md-12">
        <button @click="backup" type="button" class="btn btn-primary w-2" data-bs-toggle="tooltip"
          :disabled="global.disabled">Create
          backup</button>
      </div>

      <div class="col-md-12">
        <hr>
      </div>

      <div class="col-md-12">
        <p>Restore a previous backup of the device configuration by uploading it.</p>
      </div>
    </div>

    <div class="row">
      <form @submit.prevent="restore">
        <div class="col-md-12">
          <BsFileUpload name="upload" id="upload" label="Select backup file" accept=".txt" :disabled="global.disabled">
          </BsFileUpload>
        </div>

        <div class="col-md-3">
          <p></p>
          <button type="submit" class="btn btn-primary" value="upload" data-bs-toggle="tooltip"
            title="Upload the configuration to the device" :disabled="global.disabled">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
              :hidden="!global.disabled"></span>
            &nbsp;Restore</button>
        </div>

        <div v-if="progress>0" class="col-md-12">
          <p></p>
          <BsProgress :progress="progress"></BsProgress>
        </div>

      </form>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { global, config, getConfigChanges } from "@/modules/pinia"
import { logDebug, logError, logInfo } from '@/modules/logger'

const progress = ref(0)

function backup() {
  var backup = { meta: { version: "0.5.0", software: "PressureMon" }, config: JSON.parse(config.toJson()) }

  logDebug("BackupView.backup()", backup)

  backup.config.http_post_format = encodeURIComponent(backup.config.http_post_format)
  backup.config.http_post2_format = encodeURIComponent(backup.config.http_post2_format)
  backup.config.http_get_format = encodeURIComponent(backup.config.http_get_format)
  backup.config.influxdb2_format = encodeURIComponent(backup.config.influxdb2_format)
  backup.config.mqtt_format = encodeURIComponent(backup.config.mqtt_format)

  var s = JSON.stringify(backup, null, 2)
  var name = config.mdns + ".txt"
  download(s, "text/plain", name)
  global.messageSuccess = "Backup file created and downloaded as: " + name
}

function restore() {
  const fileElement = document.getElementById('upload');

  if (fileElement.files.length === 0) {
    global.messageFailed = "You need to select one file to restore configuration from"
  } else {
    global.disabled = true
    logDebug("BackupView.restore()", "Selected file: " + fileElement.files[0].name)
    const reader = new FileReader()
    reader.addEventListener('load', function (e) {
      let text = e.target.result
      try {
        const data = JSON.parse(text);
        if (data.meta.software === "PressureMon" && data.meta.version === "0.5.0") {
          doRestore(data.config);
        } else {
          global.messageFailed = "Unknown format, unable to process"
        }
      } catch (error) {
        console.error(error);
        global.messageFailed = "Unable to parse configuration file for GravityMon."
      }
    })
    reader.readAsText(fileElement.files[0])
  }
}

function download(content, mimeType, filename) {
  const a = document.createElement('a')
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  a.setAttribute('href', url)
  a.setAttribute('download', filename)
  a.click()
}

function doRestore(json) {
  for( var k in json) {

    if( k.endsWith("_format") ) {
      config[k] = decodeURIComponent(json[k])
    } else {
      config[k] = json[k]
    }
  }

  getConfigChanges()
  config.saveAll()
}
</script>
