const express = require('express')
var cors = require('cors')

const multer  = require('multer');
const upload = multer({ dest: "./" });

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.post('/api/firmware', upload.single('file'), function(req, res) {
  const title = req.body.title;
  const file = req.file;

  console.log(title);
  console.log(file);

  res.sendStatus(200);
});

configData = {
  // Device configuration
  id: "7376ef",
  mdns: "pressmon2",
  temp_unit: "C",
  pressure_unit: "psi",
  pressure_zero_correction: 0.12,
  pressure_sensor_type: 0,
  pressure_sensor_min: 0,
  pressure_sensor_max: 150,
  // Hardware
  voltage_factor: 1.59,
  // Wifi
  wifi_portal_timeout: 120,
  wifi_connect_timeout: 20,
  wifi_ssid: "network A",
  wifi_ssid2: "",
  wifi_pass: "password",
  wifi_pass2: "mypass",
  // Push - Generic
  sleep_interval: 30,
  push_timeout: 10,
  // Push - Http Post 1
  http_post_target: "http://post.home.arpa:9090/api/v1/ZYfjlUNeiuyu9N/telemetry",
  http_post_header1: "Auth: Basic T7IF9DD9fF3RDddE=",
  http_post_header2: "",
  // Push - Http Post 2
  http_post2_target: "http://post2.home.arpa/ispindel",
  http_post2_header1: "",
  http_post2_header2: "",
  // Push - Http Get
  http_get_target: "http://get.home.arpa/ispindel",
  http_get_header1: "",
  http_get_header2: "",
  // Push - Influx
  influxdb2_target: "http://influx.home.arpa:8086",
  influxdb2_org: "myorg",
  influxdb2_bucket: "mybucket",
  influxdb2_token: "OijkU((jhfkh=",
  // Push - MQTT
  mqtt_target: "mqtt.home.arpa",
  mqtt_port: 1883,
  mqtt_user: "user",
  mqtt_pass: "pass",
  // Push BLE
  ble_format: 0,
  dark_mode: false, 
}

formatData = {
  http_post_format: "%7B%22name%22%20%3A%20%22gravmon%22%2C%20%22ID%22%3A%20%22%24%7Bid%7D%22%2C%20%22token%22%20%3A%20%22gravmon%22%2C%20%22interval%22%3A%20%24%7Bsleep%2Dinterval%7D%2C%20%22temperature%22%3A%20%24%7Btemp%7D%2C%20%22temp%2Dunits%22%3A%20%22%24%7Btemp%2Dunit%7D%22%2C%20%22gravity%22%3A%20%24%7Bgravity%7D%2C%20%22angle%22%3A%20%24%7Bangle%7D%2C%20%22battery%22%3A%20%24%7Bbattery%7D%2C%20%22rssi%22%3A%20%24%7Brssi%7D%2C%20%22corr%2Dgravity%22%3A%20%24%7Bcorr%2Dgravity%7D%2C%20%22gravity%2Dunit%22%3A%20%22%24%7Bgravity%2Dunit%7D%22%2C%20%22run%2Dtime%22%3A%20%24%7Brun%2Dtime%7D%20%7D",
  http_post2_format: "%7B%22name%22%20%3A%20%22gravmon%22%2C%20%22ID%22%3A%20%22%24%7Bid%7D%22%2C%20%22token%22%20%3A%20%22gravmon%22%2C%20%22interval%22%3A%20%24%7Bsleep%2Dinterval%7D%2C%20%22temperature%22%3A%20%24%7Btemp%7D%2C%20%22temp%2Dunits%22%3A%20%22%24%7Btemp%2Dunit%7D%22%2C%20%22gravity%22%3A%20%24%7Bgravity%7D%2C%20%22angle%22%3A%20%24%7Bangle%7D%2C%20%22battery%22%3A%20%24%7Bbattery%7D%2C%20%22rssi%22%3A%20%24%7Brssi%7D%2C%20%22corr%2Dgravity%22%3A%20%24%7Bcorr%2Dgravity%7D%2C%20%22gravity%2Dunit%22%3A%20%22%24%7Bgravity%2Dunit%7D%22%2C%20%22run%2Dtime%22%3A%20%24%7Brun%2Dtime%7D%20%7D",
  http_get_format: "%7B%22name%22%20%3A%20%22gravmon%22%2C%20%22ID%22%3A%20%22%24%7Bid%7D%22%2C%20%22token%22%20%3A%20%22gravmon%22%2C%20%22interval%22%3A%20%24%7Bsleep%2Dinterval%7D%2C%20%22temperature%22%3A%20%24%7Btemp%7D%2C%20%22temp%2Dunits%22%3A%20%22%24%7Btemp%2Dunit%7D%22%2C%20%22gravity%22%3A%20%24%7Bgravity%7D%2C%20%22angle%22%3A%20%24%7Bangle%7D%2C%20%22battery%22%3A%20%24%7Bbattery%7D%2C%20%22rssi%22%3A%20%24%7Brssi%7D%2C%20%22corr%2Dgravity%22%3A%20%24%7Bcorr%2Dgravity%7D%2C%20%22gravity%2Dunit%22%3A%20%22%24%7Bgravity%2Dunit%7D%22%2C%20%22run%2Dtime%22%3A%20%24%7Brun%2Dtime%7D%20%7D",
  influxdb2_format: "measurement%2Chost%3D%24%7Bmdns%7D%2Cdevice%3D%24%7Bid%7D%2Ctemp%2Dformat%3D%24%7Btemp%2Dunit%7D%2Cgravity%2Dformat%3D%24%7Bgravity%2Dunit%7D%20gravity%3D%24%7Bgravity%7D%2Ccorr%2Dgravity%3D%24%7Bcorr%2Dgravity%7D%2Cangle%3D%24%7Bangle%7D%2Ctemp%3D%24%7Btemp%7D%2Cbattery%3D%24%7Bbattery%7D%2Crssi%3D%24%7Brssi%7D%0A",
  mqtt_format: "ispindel%2F%24%7Bmdns%7D%2Ftilt%3A%24%7Bangle%7D%7Cispindel%2F%24%7Bmdns%7D%2Ftemperature%3A%24%7Btemp%7D%7Cispindel%2F%24%7Bmdns%7D%2Ftemp%5Funits%3A%24%7Btemp%2Dunit%7D%7Cispindel%2F%24%7Bmdns%7D%2Fbattery%3A%24%7Bbattery%7D%7Cispindel%2F%24%7Bmdns%7D%2Fgravity%3A%24%7Bgravity%7D%7Cispindel%2F%24%7Bmdns%7D%2Finterval%3A%24%7Bsleep%2Dinterval%7D%7Cispindel%2F%24%7Bmdns%7D%2FRSSI%3A%24%7Brssi%7D%7C"
}

statusData = {
  id: "7376ef",
  pressure: 22.4,
  pressure_unit: "psi",
  temperature: 12.32,
  sleep_interval: 300,
  battery: 3.81,
  temp_unit: "C",
  rssi: -56,
  app_ver: "2.0.0",
  app_build: "gitrev",
  mdns: "gravmon",
  platform: "esp32",
  wifi_ssid: "wifi",
  total_heap: 1000,
  free_heap: 500,
  ip: "192.0.0.1",
  wifi_setup: false,
}

app.get('/api/auth', (req, res) => {
  console.log('GET: /api/auth')
  /* 
   * Description:    Perform device authentication and receive access token
   * Authentication: No
   * Limitation:     - 
   * Return:         200 OK, 401 Access Denied
   * Request body:
     {
       push_format: "http_format|http_format2|http_format3|influxdb2_format|mqtt_format"
     }
   */
  data = { token: statusData.id }

  console.log(req.headers['authorization'])
  res.send(data)
})

app.get('/api/config', (req, res) => {
  console.log('GET: /api/config')
  /* 
   * Description:    Return configuration data as json document. 
   * Authentication: Required
   * Limitation:     Don't include format templates due to their size.
   *                 Wifi passwords are removed due to security considerations (no encrypted transfer).
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   */
  res.type('application/json')
  res.send(configData)
})

app.get('/api/restart', (req, res) => {
  console.log('GET: /api/restart')
  /* 
   * Description:    Perform a restart of the device
   * Authentication: Required
   * Limitation:     - 
   * Note:           Simulator will wait 2 seconds before returning result.
   * Return:         200 OK, 401 Access Denied
   */
  setTimeout(() => {
    var data = {
      status: true,
      success: true,
      message: "Device is restarting..."
    }
    res.type('application/json')
    res.send(data)
  }, 2000)
})

var calibrateRunning = false

app.get('/api/calibrate', (req, res) => {
  console.log('GET: /api/calibrate')
  /* 
   * Description:    Initiate the gyro calibration process. 
   * Authentication: Required
   * Limitation:     - 
   * Note:           Use /api/calibrate/status to check for completion
   * Return:         200 OK, 401 Access Denied
   */
  setTimeout(() => { calibrateRunning = false }, 2000)
  calibrateRunning = true
  var data = {
    success: true,
    message: "Sensor calibration started..."
  }
  res.type('application/json')
  res.send(data)
})

app.get('/api/ping', (req, res) => {
  console.log('GET: /api/ping')
  /* 
   * Description:    Check for response from device. 
   * Authentication: Required
   * Limitation:     - 
   * Return:         200 OK
   */
  var data = {
    status: true,
  }
  res.type('application/json')
  res.send(data)
})

app.get('/api/calibrate/status', (req, res) => {
  console.log('GET: /api/calibrate/status')
  /* 
   * Description:    Return status of the current gyro calibration process. 
   * Authentication: Required
   * Limitation:     - 
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   */
  var data = {}
  if (calibrateRunning) {
    data = {
      status: calibrateRunning,
      success: false,
      message: "Sensor calibration running..."
    }
  } else {
    data = {
      status: false,
      success: true,
      message: "Sensor calibration completed..."
    }
  }
  res.type('application/json')
  res.send(data)
})

var testRunning = false

app.post('/api/push', (req, res) => {
  console.log('GET: /api/push')
  /* 
   * Description:    Initiate the push test for a defined target
   * Authentication: Required
   * Limitation:     - 
   * Note:           Use /api/test/push/status to check for completion
   * Return:         200 OK, 401 Access Denied, 422 Content Invalid
   * Request body:
     {
       push_format: "http_format|http_format2|http_format3|influxdb2_format|mqtt_format"
     }
   */
  if(!req.body.hasOwnProperty("push_format")) {
    res.sendStatus(422)
    return
  }  
  testRunning = true
  setTimeout(() => { testRunning = false }, 5000)
  var data = {
    success: true,
    message: "Test scheduled."
  }
  res.type('application/json')
  res.send(data)
})

app.get('/api/push/status', (req, res) => {
  console.log('GET: /api/push/status')
  /* 
   * Description:    Return status of the current gyro calibration process. 
   * Authentication: Required
   * Limitation:     - 
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   */
  var data = {}
  if (testRunning) {
    data = {
      status: testRunning,
      success: false,
      message: "Push test running..."
    }
  } else {
    data = {
      status: false,
      success: true,
      message: "Push test completed...",
      push_return_code: 200,
      push_enabled: true
    }
  }
  res.type('application/json')
  res.send(data)
})

app.get('/api/factory', (req, res) => {
  console.log('GET: /api/factory')
  /* 
   * Description:    Simualate a factory reset.
   * Authentication: Required
   * Limitation:     - 
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   */
  setTimeout(() => {
    var data = {
      success: true,
      message: "Factory settings restored"
    }
    res.type('application/json')
    res.send(data)
  }, 2000)
})

app.get('/api/format', (req, res) => {
  console.log('GET: /api/format')
  /* 
   * Description:    Return format data as json document. 
   * Authentication: Required
   * Limitation:     -
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   */
  res.type('application/json')
  res.send(formatData)
})

app.get('/api/status', (req, res) => {
  console.log('GET: /api/status')
  /* 
   * Description:    Return status data as json document. 
   * Authentication: None
   * Limitation:     -
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   */
  res.type('application/json')
  res.send(statusData)
})

app.post('/api/config', (req, res) => {
  console.log('POST: /api/config')
  /* 
   * Description:    Update the configuration data that is in body
   * Authentication: Required
   * Limitation:     - 
   * Note:           See config read for options.
   * Return:         200 OK, 401 Access Denied
   */
  console.log(req.body);
  for (var o in req.body) {
    configData[o] = req.body[o]
  }
  var data = {
    success: true,
    message: "Configuration stored",
  }
  res.type('application/json')
  res.send(data)
})

app.post('/api/format', (req, res) => {
  console.log('POST: /api/format')
  /* 
   * Description:    Update the format data that is in body
   * Authentication: Required
   * Limitation:     - 
   * Note:           See format read for options.
   * Return:         200 OK, 401 Access Denied
   */
  console.log(req.body);
  for (var o in req.body) {
    formatData[o] = req.body[o]
  }
  var data = {
    success: true,
    message: "Format stored",
  }
  res.type('application/json')
  res.send(data)
})

var wifiScanRunning = false

app.get('/api/wifi', (req, res) => {
  console.log('GET: /api/wifi')
  /* 
   * Description:    Do a wifi scan for avaialble networks
   * Authentication: Required
   * Limitation:     - 
   * Note:           Use /api/wifi/scan/status to check for completion
   * Return:         200 OK, 401 Access Denied
   */
  wifiScanRunning = true
  setTimeout(() => { wifiScanRunning = false }, 8000)
  var data = {
    success: true,
    message: "Wifi scan started."
  }
  res.type('application/json')
  res.send(data)
})

app.get('/api/wifi/status', (req, res) => {
  console.log('GET: /api/wifi/status')
  /* 
   * Description:    Return status of the current wifi scan process. 
   * Authentication: Required
   * Limitation:     - 
   * Note:           -
   * Return:         200 OK, 401 Access Denied
   */
  var data = {}
  if (wifiScanRunning) {
    data = {
      status: wifiScanRunning,
      success: false,
      message: "Wifi scan running..."
    }
  } else {
    data = {
      status: false,
      success: true,
      message: "Wifi scan completed...",
      networks: [ 
        { wifi_ssid: "network A", rssi: -20, channel: 10, encryption: 2 }, 
        { wifi_ssid: "network B", rssi: -70, channel: 12, encryption: 3 }, 
        { wifi_ssid: "network C", rssi: -50, channel: 6, encryption: 0 }
      ]
    }
  }
  res.type('application/json')
  res.send(data)
})

app.post('/api/filesystem', (req, res) => {
  console.log('POST: /api/filesystem')
  /* 
   * Description:    Interact with local file system on the device
   * Authentication: Required
   * Limitation:     - 
   * Return:         200 OK, 401 Access Denied, 400 Faulty request
   * Request body:
     {
       command: "dir|get|del",
       file: "name of file for get and del"
     }
   */
  console.log("Command:", req.body.command)
  
  if(req.body.command == "dir") {
    var data = { 
      total: 1000,
      used: 900,
      free: 100,
      files: [
        { file: "/error.log", size: 10 },
        { file: "/error2.log", size: 10 },
      ]
    }
    res.type('application/json')
    res.send(data)
    return
  }
  else if(req.body.command == "del") {
    console.log(req.body.file)
    setTimeout(() => {
      res.sendStatus(200)
    }, 2000)
    return
  } else if(req.body.command == "get") {
    console.log(req.body.file)
    if(req.body.file == "/error.log") {
      setTimeout(() => {
        res.send("Log entry 5\nLog entry 4\nLog entry 3\nLog entry 2\nLog entry 1\n")
      }, 1000)
      return
    } else if(req.body.file == "/error2.log") {
      setTimeout(() => {
        res.send("Log entry 9\nLog entry 8\nLog entry 7\nLog entry 6\n")
      }, 1000)
      return
    }
  } 

  res.sendStatus(400)
})

app.listen(port, () => {
  console.log(`Pressuremon API simulator port ${port}`)
})