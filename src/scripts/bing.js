// 必应每日一图（浏览器端，按可用性逐级降级）：
// 1. 当日 localStorage 缓存，避免每次进站重新探测
// 2. 官方 JSON 接口（含版权信息）：直连 → CORS 代理，逐个尝试
// 3. 免 JSON 的镜像直链（服务端 302 到当日图片）
// 4. Picsum 按日期定种的灰度图（保底，网络受限时基本可达）
// 5. 全部失败则不处理，首页展示纯渐变寒夜背景

const CACHE_KEY = 'bing-daily'
const CACHE_TTL = 6 * 60 * 60 * 1000

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
      return { url, copyright: shot.copyright ?? '' }
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
      return { url, copyright: '' }
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

function apply(data) {
  const photo = document.getElementById('hero-photo')
  const credit = document.getElementById('hero-credit')
  if (!photo || !data) return
  photo.style.backgroundImage = `url("${data.url}")`
  photo.closest('.hero')?.classList.add('has-photo')
  if (credit && data.copyright) {
    credit.textContent = `必应每日一图 · ${data.copyright}`
    credit.hidden = false
  }
}

async function initBingHero() {
  const cached = readCache()
  if (cached) {
    apply(cached)
    return
  }

  // 必应链路限时 12s，超时直接走保底，避免首屏久等
  const fromBing = await Promise.race([
    tryOfficialJson().then((r) => r || tryMirrors()),
    new Promise((resolve) => setTimeout(() => resolve(null), 12000)),
  ])
  if (fromBing) {
    writeCache(fromBing)
    apply(fromBing)
    return
  }

  try {
    await probeImage(picsumUrl(), 8000)
    const result = { url: picsumUrl(), copyright: '' }
    writeCache(result)
    apply(result)
  } catch {
    /* 全部失败：保持寒夜渐变背景 */
  }
}

initBingHero()
