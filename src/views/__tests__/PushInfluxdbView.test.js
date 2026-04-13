import { mount } from '@vue/test-utils'
import PushInfluxdbView from '../PushInfluxdbView.vue'
import { createTestingPinia } from '../../tests/testUtils'

describe('PushInfluxdbView (interaction tests)', () => {
  it('mounts without error', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushInfluxdbView, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsInputNumber: true, BsProgress: true }
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('displays page heading', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushInfluxdbView, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsInputNumber: true, BsProgress: true }
      }
    })
    expect(wrapper.text()).toContain('Influxdb')
  })

  it('displays form', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushInfluxdbView, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsInputNumber: true, BsProgress: true }
      }
    })
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('has save button', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushInfluxdbView, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsInputNumber: true, BsProgress: true }
      }
    })
    const buttons = wrapper.findAll('button')
    const saveButton = buttons.find((b) => b.text().includes('Save'))
    expect(saveButton).toBeDefined()
  })

  it('has test button', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushInfluxdbView, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsInputNumber: true, BsProgress: true }
      }
    })
    const buttons = wrapper.findAll('button')
    const testButton = buttons.find((b) => b.text().includes('push test'))
    expect(testButton).toBeDefined()
  })

  it('has save function defined', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushInfluxdbView, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsInputNumber: true, BsProgress: true }
      }
    })
    expect(typeof wrapper.vm.save).toBe('function')
  })

  it('has runTest function defined', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushInfluxdbView, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsInputNumber: true, BsProgress: true }
      }
    })
    expect(typeof wrapper.vm.runTest).toBe('function')
  })

  it('has config state defined', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushInfluxdbView, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsInputNumber: true, BsProgress: true }
      }
    })
    expect(wrapper.vm.config).toBeDefined()
  })

  it('displays container layout', () => {
    const pinia = createTestingPinia()
    const wrapper = mount(PushInfluxdbView, {
      global: {
        plugins: [pinia],
        stubs: { BsInputText: true, BsInputNumber: true, BsProgress: true }
      }
    })
    expect(wrapper.find('.container').exists()).toBe(true)
  })
})

describe.skip('PushInfluxdbView (action tests)', () => {
  beforeEach(() => vi.clearAllMocks())
  it('save calls config.saveAll when form is valid', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushInfluxdbView } = await import('../PushInfluxdbView.vue')
    const wrapper = mount(PushInfluxdbView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: { BsInputText: true, BsInputNumber: true, BsProgress: true }
      }
    })
    await wrapper.vm.save()
    const { config } = await import('@/modules/pinia')
    expect(config.saveAll).toHaveBeenCalled()
  })
  it('runTest calls config.runPushTest', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushInfluxdbView } = await import('../PushInfluxdbView.vue')
    const wrapper = mount(PushInfluxdbView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: { BsInputText: true, BsInputNumber: true, BsProgress: true }
      }
    })
    await wrapper.vm.runTest()
    const { config } = await import('@/modules/pinia')
    expect(config.runPushTest).toHaveBeenCalled()
  })

  it('influxdb2FormatCallback updates config.influxdb2_format_gravity', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushInfluxdbView } = await import('../PushInfluxdbView.vue')
    const { config } = await import('@/modules/pinia')
    const wrapper = mount(PushInfluxdbView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: { BsInputText: true, BsInputNumber: true, BsProgress: true }
      }
    })
    wrapper.vm.influxdb2FormatCallback(encodeURIComponent('measurement,tag=val field=1.0'))
    expect(config.influxdb2_format_gravity).not.toBeUndefined()
  })

  it('renderFormat does not throw', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushInfluxdbView } = await import('../PushInfluxdbView.vue')
    const wrapper = mount(PushInfluxdbView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: { BsInputText: true, BsInputNumber: true, BsProgress: true }
      }
    })
    expect(() => wrapper.vm.renderFormat()).not.toThrow()
  })

  it('pushDisabled returns true when influxdb is false', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushInfluxdbView } = await import('../PushInfluxdbView.vue')
    const { global } = await import('@/modules/pinia')
    global.disabled = true
    const wrapper = mount(PushInfluxdbView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: { BsInputText: true, BsInputNumber: true, BsProgress: true }
      }
    })
    expect(wrapper.vm.pushDisabled).toBe(true)
  })

  it('influxdb2FormatCallback decodes and updates format', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushInfluxdbView } = await import('../PushInfluxdbView.vue')
    const { config } = await import('@/modules/pinia')
    const wrapper = mount(PushInfluxdbView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: { BsInputText: true, BsInputNumber: true, BsProgress: true }
      }
    })
    wrapper.vm.influxdb2FormatCallback(encodeURIComponent('measurement,tag=val field=1.0'))
    expect(config.influxdb2_format_gravity).toBeDefined()
  })

  it('runTest handles exception from config.runPushTest', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushInfluxdbView } = await import('../PushInfluxdbView.vue')
    const { config, global } = await import('@/modules/pinia')
    vi.spyOn(config, 'runPushTest').mockRejectedValueOnce(new Error('Connection refused'))
    global.messageError = ''
    const wrapper = mount(PushInfluxdbView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: { BsInputText: true, BsInputNumber: true, BsProgress: true }
      }
    })
    await wrapper.vm.runTest()
    expect(global.messageError).toBe('Failed to start push test')
  })

  it('save does not call config.saveAll when form validation fails', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushInfluxdbView } = await import('../PushInfluxdbView.vue')
    const { validateCurrentForm } = await import('@mp-se/espframework-ui-components')
    const { config } = await import('@/modules/pinia')
    vi.mocked(validateCurrentForm).mockReturnValue(false)
    config.saveAll = vi.fn()
    const wrapper = mount(PushInfluxdbView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: { BsInputText: true, BsInputNumber: true, BsProgress: true }
      }
    })
    await wrapper.vm.save()
    expect(config.saveAll).not.toHaveBeenCalled()
  })

  it('pushDisabled returns false when global.disabled is false and use_wifi_direct is false', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushInfluxdbView } = await import('../PushInfluxdbView.vue')
    const { global, config } = await import('@/modules/pinia')
    global.disabled = false
    config.use_wifi_direct = false
    const wrapper = mount(PushInfluxdbView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: { BsInputText: true, BsInputNumber: true, BsProgress: true }
      }
    })
    expect(wrapper.vm.pushDisabled).toBe(false)
  })

  it('pushDisabled returns true when use_wifi_direct is true', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushInfluxdbView } = await import('../PushInfluxdbView.vue')
    const { config } = await import('@/modules/pinia')
    config.use_wifi_direct = true
    const wrapper = mount(PushInfluxdbView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: { BsInputText: true, BsInputNumber: true, BsProgress: true }
      }
    })
    expect(wrapper.vm.pushDisabled).toBe(true)
    config.use_wifi_direct = false
  })

  it('runTest calls global.clearMessages before runPushTest', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushInfluxdbView } = await import('../PushInfluxdbView.vue')
    const { global } = await import('@/modules/pinia')
    const wrapper = mount(PushInfluxdbView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: { BsInputText: true, BsInputNumber: true, BsProgress: true }
      }
    })
    await wrapper.vm.runTest()
    expect(global.clearMessages).toHaveBeenCalled()
  })

  it('renderFormat sets render from influxdb2 format template', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushInfluxdbView } = await import('../PushInfluxdbView.vue')
    const { config } = await import('@/modules/pinia')
    config.influxdb2_format_gravity = 'gravity,unit=SG value={gravity}'
    const wrapper = mount(PushInfluxdbView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: { BsInputText: true, BsInputNumber: true, BsProgress: true }
      }
    })
    wrapper.vm.renderFormat()
    expect(typeof wrapper.vm.render).toBe('string')
  })

  it('renders form with all fields using real template', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushInfluxdbView } = await import('../PushInfluxdbView.vue')
    const { global, config } = await import('@/modules/pinia')
    global.disabled = false
    config.use_wifi_direct = false
    const wrapper = mount(PushInfluxdbView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          BsInputText: {
            template:
              '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
            props: ['modelValue'],
            emits: ['update:modelValue']
          },
          BsInputNumber: true,
          BsDropdown: true,
          BsModal: true,
          BsInputTextAreaFormat: true
        }
      }
    })
    expect(wrapper.find('form').exists()).toBe(true)
    // Trigger input update to cover v-model handler functions
    const inputs = wrapper.findAll('input')
    if (inputs.length > 0) {
      await inputs[0].trigger('input')
    }
  })

  it('v-model bindings trigger all config updates via emitting stubs', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: View } = await import('../PushInfluxdbView.vue')
    const { global } = await import('@/modules/pinia')
    global.disabled = false

    const inputStub = {
      template:
        '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
      props: [
        'modelValue',
        'type',
        'disabled',
        'maxlength',
        'label',
        'help',
        'min',
        'max',
        'step',
        'width',
        'unit',
        'rows'
      ],
      emits: ['update:modelValue']
    }
    const textareaStub = {
      template:
        '<textarea :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)"></textarea>',
      props: ['modelValue', 'disabled', 'rows', 'label', 'help'],
      emits: ['update:modelValue']
    }
    const wrapper = mount(View, {
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          BsInputText: inputStub,
          BsInputNumber: inputStub,
          BsInputTextAreaFormat: textareaStub,
          BsModal: true,
          BsDropdown: true
        }
      }
    })
    for (const el of wrapper.findAll('input')) {
      await el.trigger('input')
    }
    for (const el of wrapper.findAll('textarea')) {
      await el.trigger('input')
    }
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('triggers BsModal v-model update for render ref', async () => {
    const { createTestingPinia } = await import('../../tests/testUtils')
    const { mount } = await import('@vue/test-utils')
    const { default: PushInfluxdbView } = await import('../PushInfluxdbView.vue')
    const wrapper = mount(PushInfluxdbView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          BsInputText: true,
          BsInputNumber: true,
          BsInputTextAreaFormat: true,
          BsInputSwitch: true,
          BsDropdown: true,
          BsModal: {
            template:
              '<button class="modal-emit" @click="$emit(\'update:modelValue\', \'test\')" />',
            props: ['modelValue', 'code', 'title', 'button'],
            emits: ['update:modelValue']
          }
        }
      }
    })
    const btn = wrapper.find('.modal-emit')
    if (btn.exists()) await btn.trigger('click')
    expect(wrapper.exists()).toBe(true)
  })
})

describe('PushInfluxdbView (pressure action tests)', () => {
  const mountView = () =>
    mount(PushInfluxdbView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          BsInputText: true,
          BsInputNumber: true,
          BsInputTextAreaFormat: true,
          BsModal: true,
          BsDropdown: true
        }
      }
    })

  beforeEach(() => vi.clearAllMocks())

  it('saves influx settings when valid', async () => {
    const { config } = await import('@/modules/pinia')
    const wrapper = mountView()
    await wrapper.vm.save()
    expect(config.saveAll).toHaveBeenCalled()
  })

  it('runs the influx pressure push test', async () => {
    const { config, global } = await import('@/modules/pinia')
    config.runPushTest = vi.fn(async () => true)
    const wrapper = mountView()
    await wrapper.vm.runTest()
    expect(global.clearMessages).toHaveBeenCalled()
    expect(config.runPushTest).toHaveBeenCalledWith({ push_format: 'influxdb2_format_pressure' })
  })

  it('format callback updates the influx pressure format', async () => {
    const { config } = await import('@/modules/pinia')
    const wrapper = mountView()
    wrapper.vm.influxdb2FormatCallback(encodeURIComponent('pressure value={pressure}'))
    expect(config.influxdb2_format_pressure).toBe('pressure value={pressure}')
  })

  it('renderFormat applies the influx pressure template', async () => {
    const { config } = await import('@/modules/pinia')
    config.influxdb2_format_pressure = 'pressure value={pressure}'
    const wrapper = mountView()
    wrapper.vm.renderFormat()
    expect(wrapper.vm.render).toBeTruthy()
  })

  it('does not save influx settings when form validation fails', async () => {
    const { validateCurrentForm } = await import('@mp-se/espframework-ui-components')
    const { config } = await import('@/modules/pinia')
    vi.mocked(validateCurrentForm).mockReturnValue(false)
    config.saveAll = vi.fn()
    const wrapper = mountView()
    await wrapper.vm.save()
    expect(config.saveAll).not.toHaveBeenCalled()
  })

  it('disables push controls when wifi direct is enabled', async () => {
    const { config } = await import('@/modules/pinia')
    config.use_wifi_direct = true
    const wrapper = mountView()
    expect(wrapper.vm.pushDisabled).toBe(true)
    config.use_wifi_direct = false
  })

  it('renders all influx input labels with explicit field stubs', () => {
    const wrapper = mount(PushInfluxdbView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          BsInputText: { props: ['label'], template: '<div>{{ label }}</div>' },
          BsInputNumber: { props: ['label'], template: '<div>{{ label }}</div>' },
          BsInputTextAreaFormat: { props: ['label'], template: '<div>{{ label }}</div>' },
          BsDropdown: { props: ['label'], template: '<div>{{ label }}</div>' },
          BsModal: { props: ['title'], template: '<div>{{ title }}</div>' }
        }
      }
    })

    expect(wrapper.text()).toContain('Server')
    expect(wrapper.text()).toContain('Organisation')
    expect(wrapper.text()).toContain('Bucket')
    expect(wrapper.text()).toContain('Authentication token')
    expect(wrapper.text()).toContain('Data format')
    expect(wrapper.text()).toContain('Format preview')
  })

  it('binds influx field values and preview modal state through component props', async () => {
    const { config } = await import('@/modules/pinia')
    config.influxdb2_target = 'https://example.test/write'
    config.influxdb2_org = 'pressuremon'
    config.influxdb2_bucket = 'bucket-a'
    config.influxdb2_token = 'secret-token'
    config.influxdb2_int = 3
    config.influxdb2_format_pressure = 'pressure value={pressure}'

    const wrapper = mount(PushInfluxdbView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          BsInputText: {
            props: ['modelValue', 'label', 'disabled'],
            template:
              '<div class="text-field" :data-label="label" :data-model-value="modelValue" :data-disabled="String(disabled)" />'
          },
          BsInputNumber: {
            props: ['modelValue', 'label', 'disabled'],
            template:
              '<div class="number-field" :data-label="label" :data-model-value="String(modelValue)" :data-disabled="String(disabled)" />'
          },
          BsInputTextAreaFormat: {
            props: ['modelValue', 'label', 'disabled'],
            template:
              '<div class="textarea-field" :data-label="label" :data-model-value="modelValue" :data-disabled="String(disabled)" />'
          },
          BsDropdown: {
            props: ['label', 'callback'],
            template:
              '<button class="dropdown-proxy" @click="callback(encodeURIComponent(\'updated format\'))">{{ label }}</button>'
          },
          BsModal: {
            props: ['modelValue', 'title', 'disabled'],
            emits: ['update:modelValue', 'click'],
            template:
              '<button class="modal-proxy" :data-model-value="modelValue" :data-disabled="String(disabled)" @click="$emit(\'update:modelValue\', \'preview\'); $emit(\'click\')">{{ title }}</button>'
          }
        }
      }
    })

    expect(wrapper.find('[data-label="Bucket"]').attributes('data-model-value')).toBe('bucket-a')
    expect(wrapper.find('[data-label="Authentication token"]').attributes('data-model-value')).toBe(
      'secret-token'
    )
    expect(wrapper.find('[data-label="Skip interval"]').attributes('data-model-value')).toBe('3')
    expect(wrapper.find('[data-label="Data format"]').attributes('data-model-value')).toBe(
      'pressure value={pressure}'
    )

    await wrapper.find('.dropdown-proxy').trigger('click')
    expect(config.influxdb2_format_pressure).toBe('updated format')

    await wrapper.find('.modal-proxy').trigger('click')
    expect(wrapper.vm.render).toBeTruthy()
  })

  it('updates all influx models from child component emits', async () => {
    const { config } = await import('@/modules/pinia')
    const wrapper = mount(PushInfluxdbView, {
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          BsInputText: {
            props: ['label'],
            emits: ['update:modelValue'],
            template:
              '<button class="text-emit" :data-label="label" @click="$emit(\'update:modelValue\', label + \' value\')">{{ label }}</button>'
          },
          BsInputNumber: {
            props: ['label'],
            emits: ['update:modelValue'],
            template:
              '<button class="number-emit" :data-label="label" @click="$emit(\'update:modelValue\', 5)">{{ label }}</button>'
          },
          BsInputTextAreaFormat: {
            props: ['label'],
            emits: ['update:modelValue'],
            template:
              '<button class="textarea-emit" :data-label="label" @click="$emit(\'update:modelValue\', \'pressure value={pressure}\')">{{ label }}</button>'
          },
          BsDropdown: true,
          BsModal: true
        }
      }
    })

    for (const button of wrapper.findAll('.text-emit, .number-emit, .textarea-emit')) {
      await button.trigger('click')
    }

    expect(config.influxdb2_target).toBe('Server value')
    expect(config.influxdb2_org).toBe('Organisation value')
    expect(config.influxdb2_bucket).toBe('Bucket value')
    expect(config.influxdb2_token).toBe('Authentication token value')
    expect(config.influxdb2_int).toBe(5)
    expect(config.influxdb2_format_pressure).toBe('pressure value={pressure}')
  })
})
