// 必应每日一图（浏览器端无后端，按可用性逐级降级）：
// 1. 当日 localStorage 缓存，避免每次进站重新探测
// 2. 官方 JSON 接口（含版权信息）：直连 → CORS 代理，逐个尝试
// 3. 免 JSON 的镜像直链（服务端 302 到当日图片）
// 4. Picsum 按日期定种的灰度图（保底，网络受限时基本可达）
// 5. 全部失败返回 null，首页展示纯渐变寒夜背景

const CACHE_KEY = 'bing-daily'
const CACHE_TTL = 6 * 60 * 60 * 1000

// 【预览用】代码级强制背景图：设置后所有浏览器都会显示这一张（优先级最高）。
// 看完想恢复自动每日一图：把 FORCE_IMAGE 改回 null 即可。
// 备选图（必应近期档案，直接换 url 即可）：
//   火箭「宇宙在召唤」   https://www.bing.com/th?id=OHR.ArtemisRocket_ZH-CN1768541365_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp
//   河流「一条值得保护的河流」 https://www.bing.com/th?id=OHR.ChattoogaRiver_ZH-CN9453791496_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp
const FORCE_IMAGE = null

// 调试/预览用：localStorage 存在 bing-daily-override 时强制使用指定图片（优先级最高）
// 用法（浏览器控制台）：
//   localStorage.setItem('bing-daily-override', JSON.stringify({
//     url: 'https://www.bing.com/th?id=...', copyright: '图片说明（可省略）'
//   }))
// 清除：localStorage.removeItem('bing-daily-override')
const OVERRIDE_KEY = 'bing-daily-override'

function readOverride() {
  try {
    const v = JSON.parse(localStorage.getItem(OVERRIDE_KEY))
    if (v?.url) {
      return { url: v.url, copyright: v.copyright ?? '', title: v.title ?? '', source: v.source ?? 'bing' }
    }
  } catch {
    /* 无效覆盖则忽略 */
  }
  return null
}

const BING_JSON = 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN'
const MIRROR_IMAGES = [
  'https://bing.img.run/1920x1080.php',
  'https://api.vvhan.com/api/bingimg',
  'https://api.dujin.org/bing/1920.php',
]

function readCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY))
    if (cached?.url && Date.now() - cached.ts < CACHE_TTL) return cached
  } catch {
    /* 缓存损坏则忽略 */
  }
  return null
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...data, ts: Date.now() }))
  } catch {
    /* 存储不可用则忽略 */
  }
}

function fetchJsonWithTimeout(url, ms = 6000) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), ms)
  return fetch(url, { signal: ctrl.signal })
    .then(async (res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    })
    .finally(() => clearTimeout(timer))
}

/** 预加载验证图片真实可显示（<img> 不受 CORS 限制） */
function probeImage(url, ms = 9000) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const timer = setTimeout(() => {
      img.src = ''
      reject(new Error('timeout'))
    }, ms)
    img.onload = () => {
      clearTimeout(timer)
      resolve(url)
    }
    img.onerror = () => {
      clearTimeout(timer)
      reject(new Error('load error'))
    }
    img.src = url
  })
}

async function tryOfficialJson() {
  const encoded = encodeURIComponent(BING_JSON)
  const candidates = [
    BING_JSON,
    `https://api.allorigins.win/raw?url=${encoded}`,
    `https://corsproxy.io/?url=${encoded}`,
  ]
  for (const candidate of candidates) {
    try {
      const data = await fetchJsonWithTimeout(candidate)
      const shot = data?.images?.[0]
      if (!shot?.url) continue
      const url = shot.url.startsWith('http') ? shot.url : `https://www.bing.com${shot.url}`
      await probeImage(url)
      return { url, copyright: shot.copyright ?? '', title: shot.title ?? '', source: 'bing' }
    } catch {
      /* 尝试下一候选 */
    }
  }
  return null
}

async function tryMirrors() {
  for (const url of MIRROR_IMAGES) {
    try {
      await probeImage(url)
      return { url, copyright: '', title: '', source: 'bing' }
    } catch {
      /* 尝试下一镜像 */
    }
  }
  return null
}

/** Picsum 按当天日期定种：同一天稳定同一张，效果等同「每日一图」 */
function picsumUrl() {
  const d = new Date()
  const seed = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  return `https://picsum.photos/seed/${seed}/1920/1080?grayscale`
}

export async function fetchBingDaily() {
  // 代码级强制图优先（FORCE_IMAGE 置 null 后走下面的自动链路）
  if (FORCE_IMAGE?.url) return FORCE_IMAGE

  const override = readOverride()
  if (override) return override

  const cached = readCache()
  if (cached) return cached

  // 必应链路限时 12s，超时直接走保底，避免首屏久等
  const fromBing = await Promise.race([
    tryOfficialJson().then((r) => r || tryMirrors()),
    new Promise((resolve) => setTimeout(() => resolve(null), 12000)),
  ])
  if (fromBing) {
    writeCache(fromBing)
    return fromBing
  }

  try {
    await probeImage(picsumUrl(), 8000)
    const result = { url: picsumUrl(), copyright: '', title: '', source: 'picsum' }
    writeCache(result)
    return result
  } catch {
    return null
  }
}
