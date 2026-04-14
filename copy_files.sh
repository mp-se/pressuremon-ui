#!/bin/bash
#
# Pressuremon - Dual License
#
# Open Source Use  ->  GNU General Public License v3.0 (GPL v3)
# Commercial Use   ->  Commercial License Agreement
#
# Copyright (c) 2024-2026 Magnus
#
# For full license terms and conditions, see LICENSE and LICENSE_COMMERCIAL files.
# Source: https://github.com/mp-se/pressuremon and https://github.com/mp-se/pressuremon-ui
#

# Used to copy the views and tests that are standard across all my projects

# Fragment Components
cp ../gravitymon-ui/src/fragments/AdvancedFilesFragment.vue ./src/fragments/AdvancedFilesFragment.vue
cp ../gravitymon-ui/src/fragments/ListFilesFragment.vue ./src/fragments/ListFilesFragment.vue
cp ../gravitymon-ui/src/fragments/VoltageFragment.vue ./src/fragments/VoltageFragment.vue
cp ../gravitymon-ui/src/fragments/EnableCorsFragment.vue ./src/fragments/EnableCorsFragment.vue

# Fragment Tests
cp ../gravitymon-ui/src/fragments/__tests__/AdvancedFilesFragment.test.js ./src/fragments/__tests__/AdvancedFilesFragment.test.js
cp ../gravitymon-ui/src/fragments/__tests__/ListFilesFragment.test.js ./src/fragments/__tests__/ListFilesFragment.test.js
cp ../gravitymon-ui/src/fragments/__tests__/VoltageFragment.test.js ./src/fragments/__tests__/VoltageFragment.test.js
cp ../gravitymon-ui/src/fragments/__tests__/EnableCorsFragment.test.js ./src/fragments/__tests__/EnableCorsFragment.test.js

# View Components
cp ../gravitymon-ui/src/views/FirmwareView.vue ./src/views/FirmwareView.vue
cp ../gravitymon-ui/src/views/SerialView.vue ./src/views/SerialView.vue
cp ../gravitymon-ui/src/views/NotFoundView.vue ./src/views/NotFoundView.vue
cp ../gravitymon-ui/src/views/DeviceWifiView.vue ./src/views/DeviceWifiView.vue
cp ../gravitymon-ui/src/views/DeviceWifi2View.vue ./src/views/DeviceWifi2View.vue
cp ../gravitymon-ui/src/views/ToolsView.vue ./src/views/ToolsView.vue

# View Tests
cp ../gravitymon-ui/src/views/__tests__/FirmwareView.test.js ./src/views/__tests__/FirmwareView.test.js
cp ../gravitymon-ui/src/views/__tests__/SerialView.test.js ./src/views/__tests__/SerialView.test.js
cp ../gravitymon-ui/src/views/__tests__/NotFoundView.test.js ./src/views/__tests__/NotFoundView.test.js
cp ../gravitymon-ui/src/views/__tests__/DeviceWifiView.test.js ./src/views/__tests__/DeviceWifiView.test.js
cp ../gravitymon-ui/src/views/__tests__/DeviceWifi2View.test.js ./src/views/__tests__/DeviceWifi2View.test.js
cp ../gravitymon-ui/src/views/__tests__/ToolsView.test.js ./src/views/__tests__/ToolsView.test.js

echo "✓ Components and tests synced from gravitymon-ui"
