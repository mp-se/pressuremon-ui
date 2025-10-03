<template>
  <BsMessage :dismissable="false" alert="danger">
    Page not found! <span class="fw-bold">{{ route.path }}</span> is not a valid URL for this
    application!
  </BsMessage>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
