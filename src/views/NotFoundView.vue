<!--
  Pressuremon - Dual License

  Open Source Use  ->  GNU General Public License v3.0 (GPL v3)
  Commercial Use   ->  Commercial License Agreement

  Copyright (c) 2024-2026 Magnus

  For full license terms and conditions, see LICENSE and LICENSE_COMMERCIAL files.
  Source: https://github.com/mp-se/pressuremon and https://github.com/mp-se/pressuremon-ui
-->
<template>
  <BsMessage :dismissable="false" alert="danger">
    Page not found! <span class="fw-bold">{{ this.$route.path }}</span> is not a valid URL for this
    application!
  </BsMessage>
</template>
