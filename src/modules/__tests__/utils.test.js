import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  global: {
    app_ver: '0.7.0',
    app_build: '42'
  },
  logError: vi.fn()
}))

vi.mock('@/modules/pinia', () => ({
  global: mocks.global
}))

vi.mock('@mp-se/espframework-ui-components', () => ({
  logError: mocks.logError,
  tempToF: (c) => (c * 9) / 5 + 32,
  tempToC: (f) => ((f - 32) * 5) / 9,
  psiToBar: (psi) => psi * 0.0689476,
  psiToKPa: (psi) => psi * 6.89476,
  barToPsi: (bar) => bar / 0.0689476,
  kpaToPsi: (kpa) => kpa / 6.89476
}))

import {
  applyTemplate,
  httpGetFormatOptions,
  httpGetUrlOptions,
  httpHeaderOptions,
  httpPostFormatOptions,
  httpPostUrlOptions,
  influxdb2FormatOptions,
  mqttFormatOptions
} from '../utils'

describe('utils.applyTemplate', () => {
  beforeEach(() => {
    mocks.logError.mockReset()
  })

  it('replaces temperature and pressure placeholders in valid JSON', () => {
    const result = applyTemplate(
      { temp: 20, pressure: 10, pressure1: 11, rssi: -55, battery: 3.7 },
      {
        mdns: 'pressuremon-test',
        id: 'device-1',
        sleep_interval: 60,
        token: 'token-1',
        token2: 'token-2',
        temp_unit: 'C',
        pressure_unit: 'psi'
      },
      '{"temp": ${temp}, "tempF": ${temp-f}, "pressure": ${pressure}, "pressure1": ${pressure1}}'
    )

    const json = JSON.parse(result)
    expect(json.temp).toBe(20)
    expect(json.tempF).toBe(68)
    expect(json.pressure).toBe(10)
    expect(json.pressure1).toBe(11)
  })

  it('converts bar input back to psi-based placeholders', () => {
    const result = applyTemplate(
      { temp: 20, pressure: 1, pressure1: 0.5, isBar: true, rssi: -40, battery: 3.8 },
      {
        mdns: 'pressuremon-test',
        id: 'device-1',
        sleep_interval: 60,
        token: '',
        token2: '',
        temp_unit: 'C',
        pressure_unit: 'bar'
      },
      '{"psi": ${pressure-psi}, "bar": ${pressure-bar}}'
    )

    const json = JSON.parse(result)
    expect(json.psi).toBeCloseTo(14.5038, 3)
    expect(json.bar).toBeCloseTo(1, 3)
  })

  it('converts Fahrenheit templates back to Celsius placeholders', () => {
    const result = applyTemplate(
      { temp: 68, pressure: 10, pressure1: 11, rssi: -42, battery: 3.9 },
      {
        mdns: 'pressuremon-test',
        id: 'device-2',
        sleep_interval: 120,
        token: 'token-a',
        token2: 'token-b',
        temp_unit: 'F',
        pressure_unit: 'psi'
      },
      '{"tempC": ${temp-c}, "tempF": ${temp-f}}'
    )

    const json = JSON.parse(result)
    expect(json.tempC).toBeCloseTo(20, 3)
    expect(json.tempF).toBe(68)
  })

  it('converts kPa input back to psi-based placeholders for both sensors', () => {
    const result = applyTemplate(
      { temp: 20, pressure: 68.9476, pressure1: 34.4738, isKPa: true, rssi: -30, battery: 3.6 },
      {
        mdns: 'pressuremon-test',
        id: 'device-3',
        sleep_interval: 30,
        token: '',
        token2: '',
        temp_unit: 'C',
        pressure_unit: 'kPa'
      },
      '{"psi": ${pressure-psi}, "bar2": ${pressure1-bar}, "kpa2": ${pressure1-kpa}}'
    )

    const json = JSON.parse(result)
    expect(json.psi).toBeCloseTo(10, 3)
    expect(json.bar2).toBeCloseTo(0.344738, 3)
    expect(json.kpa2).toBeCloseTo(34.4738, 3)
  })

  it('returns a plain string for non-json templates', () => {
    const result = applyTemplate(
      { temp: 20, pressure: 10, pressure1: 11, rssi: -55, battery: 3.7 },
      {
        mdns: 'pressuremon-test',
        id: 'device-1',
        sleep_interval: 60,
        token: '',
        token2: '',
        temp_unit: 'C',
        pressure_unit: 'psi'
      },
      'pressure=${pressure}, temp=${temp}, unit=${pressure-unit}'
    )

    expect(result).toContain('pressure=10')
    expect(result).toContain('temp=20')
    expect(result).toContain('unit=psi')
    expect(mocks.logError).toHaveBeenCalled()
  })
})

describe('utils constants', () => {
  it('uses pressuremon as the default user agent', () => {
    const userAgent = httpHeaderOptions.value.find((item) => item.label === 'User agent')
    expect(userAgent.value).toBe('User-Agent: pressuremon')
  })

  it('exports expected format option groups', () => {
    expect(httpPostUrlOptions.value[0].label).toBe('-- none --')
    expect(httpPostFormatOptions.value.some((item) => item.label.includes('Pressuremon'))).toBe(
      true
    )
    expect(httpGetFormatOptions.value.some((item) => item.label.includes('Pressuremon'))).toBe(true)
    expect(influxdb2FormatOptions.value.some((item) => item.label.includes('Pressuremon'))).toBe(
      true
    )
    expect(mqttFormatOptions.value.some((item) => item.label.includes('Pressuremon'))).toBe(true)
    expect(httpGetUrlOptions.value[0].value).toBe('')
  })
})
