const getWxCloudApiToken = require('../../src/utils/getWxCloudApiToken')

let wxApiToken
let wxTriggerApiTokenV0
let scfTriggerSrc

beforeEach(() => {
  wxApiToken = process.env.WX_API_TOKEN
  wxTriggerApiTokenV0 = process.env.WX_TRIGGER_API_TOKEN_V0
  scfTriggerSrc = process.env.TRIGGER_SRC
})

afterEach(() => {
  process.env.WX_API_TOKEN = wxApiToken
  process.env.WX_TRIGGER_API_TOKEN_V0 = wxTriggerApiTokenV0
  process.env.TRIGGER_SRC = scfTriggerSrc
})

// 由定时触发器触发时（TRIGGER_SRC=timer）：优先使用 WX_TRIGGER_API_TOKEN_V0，不存在的话，为了兼容兼容旧的开发者工具，也是使用 WX_API_TOKEN
// 非定时触发器触发时（TRIGGER_SRC!=timer）: 使用 WX_API_TOKEN

describe('getWxCloudApiToken: 获取WxCloudApiToken', () => {
  it('定时触发器触发：只写入 WX_API_TOKEN 时，使用 WX_API_TOKEN', function() {
    process.env.TRIGGER_SRC = 'timer'
    process.env.WX_API_TOKEN = 'WX_API_TOKEN'
    process.env.WX_TRIGGER_API_TOKEN_V0 = ''
    expect(getWxCloudApiToken()).toBe('WX_API_TOKEN')
  })

  it('定时触发器触发：只写入 WX_TRIGGER_API_TOKEN_V0 时，使用 WX_TRIGGER_API_TOKEN_V0', function() {
    process.env.TRIGGER_SRC = 'timer'
    process.env.WX_API_TOKEN = ''
    process.env.WX_TRIGGER_API_TOKEN_V0 = 'WX_TRIGGER_API_TOKEN_V0'
    expect(getWxCloudApiToken()).toBe('WX_TRIGGER_API_TOKEN_V0')
  })

  it('定时触发器触发：WX_API_TOKEN 和 WX_TRIGGER_API_TOKEN_V0 共存时优先使用 WX_TRIGGER_API_TOKEN_V0', function() {
    process.env.TRIGGER_SRC = 'timer'
    process.env.WX_API_TOKEN = 'WX_API_TOKEN'
    process.env.WX_TRIGGER_API_TOKEN_V0 = 'WX_TRIGGER_API_TOKEN_V0'
    expect(getWxCloudApiToken()).toBe('WX_TRIGGER_API_TOKEN_V0')
  })

  it('非定时触发器触发：只写入 WX_API_TOKEN 时，使用 WX_API_TOKEN', function() {
    process.env.TRIGGER_SRC = 'timer'
    process.env.WX_API_TOKEN = 'WX_API_TOKEN'
    process.env.WX_TRIGGER_API_TOKEN_V0 = ''
    expect(getWxCloudApiToken()).toBe('WX_API_TOKEN')
  })

  it('非定时触发器触发：只写入 WX_TRIGGER_API_TOKEN_V0 时，使用默认值', function() {
    process.env.TRIGGER_SRC = 'tcb'
    process.env.WX_API_TOKEN = ''
    process.env.WX_TRIGGER_API_TOKEN_V0 = 'WX_TRIGGER_API_TOKEN_V0'
    expect(getWxCloudApiToken()).toBe('')
  })

  it('非定时触发器触发：WX_API_TOKEN 和 WX_TRIGGER_API_TOKEN_V0 共存时, 使用 WX_API_TOKEN', function() {
    process.env.TRIGGER_SRC = 'tcb'
    process.env.WX_API_TOKEN = 'WX_API_TOKEN'
    process.env.WX_TRIGGER_API_TOKEN_V0 = 'WX_TRIGGER_API_TOKEN_V0'
    expect(getWxCloudApiToken()).toBe('WX_API_TOKEN')
  })

  it('默认为空', function() {
    process.env.WX_API_TOKEN = ''
    process.env.WX_TRIGGER_API_TOKEN_V0 = ''
    expect(getWxCloudApiToken()).toBe('')
  })
})
