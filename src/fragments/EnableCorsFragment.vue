<template>
  <h5>Developer settings</h5>
  <div class="row gy-4">
    <div class="col-md-3">
      <button
        @click="enableCors"
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
        &nbsp;Enable CORS</button
      >&nbsp;
    </div>
  </div>
</template>

<script setup>
import { global } from '@/modules/pinia'
import { logInfo, logError } from '@/modules/logger'
import { useFetch } from '@/composables/useFetch'

const { managedFetch } = useFetch()

const enableCors = async () => {
  global.disabled = true
  global.clearMessages()

  const data = {
    cors_allowed: true
  }

  try {
    const response = await managedFetch(global.baseURL + 'api/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: global.token
      },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(global.fetchTimout)
    })
    
    if (response.status !== 200) {
      logError('EnableCorsFragment.enableCors()', 'Sending /api/config failed', response.status)
      global.messageError = 'Failed to enable CORS.'
    } else {
      logInfo('EnableCorsFragment.enableCors()', 'Sending /api/config completed')
      global.messageSuccess = 'CORS enabled in configuration, reboot to take effect.'
    }
  } catch (err) {
    logError('EnableCorsFragment.enableCors()', err)
    global.messageError = 'Failed to enable CORS.'
  } finally {
    global.disabled = false
  }
}
</script>
