<template>
  <div class="container">
    <p></p>
    <p class="h3">Tools</p>
    <hr />

    <VoltageFragment></VoltageFragment>

    <div class="row gy-4">
      <p></p>
      <hr />
    </div>

    <ListFilesFragment></ListFilesFragment>

    <div class="row gy-4">
      <p></p>
      <hr />
    </div>

    <div class="row gy-4" v-if="hideAdvanced">
      <div class="col-md-2">
        <button
          @click="enableAdvanced()"
          type="button"
          class="btn btn-secondary"
          :disabled="global.disabled"
        >
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
            v-show="global.disabled"
          ></span>
          &nbsp;Enable Advanced
        </button>
      </div>
    </div>

    <AdvancedFileFragment v-if="!hideAdvanced"></AdvancedFileFragment>

    <div class="row gy-4" v-if="!hideAdvanced">
      <p></p>
      <hr />
    </div>

    <EnableCorsFragment v-if="!hideAdvanced"></EnableCorsFragment>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { global } from '@/modules/pinia'
// NOTE: Using local enhanced versions of fragments due to pinia import path issues
// Framework fragments import '@/modules/pinia' which doesn't exist in framework context
import VoltageFragment from '@/fragments/VoltageFragment.vue'
import ListFilesFragment from '@/fragments/ListFilesFragment.vue'
import AdvancedFileFragment from '@/fragments/AdvancedFileFragment.vue'
import EnableCorsFragment from '@/fragments/EnableCorsFragment.vue'

const hideAdvanced = ref(true)

function enableAdvanced() {
  hideAdvanced.value = !hideAdvanced.value
}
</script>
