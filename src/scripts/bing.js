// 必应每日一图（浏览器端）——速度优先策略：
// 1. 当日 localStorage 缓存：直接命中，秒显
// 2. 多源并行竞速：必应镜像直链与保底图同时开跑，最先加载成功者胜出，
//    其余立即中止；单一来源超时 6s，整体不再串行等待
// 3. 胜出后后台尝试补拉官方版权信息（不阻塞首屏）
// 4. 全部失败：保持寒夜渐变背景

const CACHE_KEY = 'bing-daily'
const CACHE_TTL = 6 * 60 * 60 * 1000
const SOURCE_TIMEOUT = 5000

// 镜像直链（服务端 302 到当日图片，省去 JSON 往返）
const SOURCES = [
  'https://bing.img.run/1920x1080.php',
  'https://api.vvhan.com/api/bingimg',
  'https://api.dujin.org/bing/1920.php',
]

/** Picsum 按当天日期定种：同一天稳定同一张，效果等同「每日一图」 */
function picsumUrl() {
  const d = new Date()
  const seed = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  return `https://picsum.photos/seed/${seed}/1920/1080?grayscale`
}

/** 预加载单张图片，成功返回 URL */
function probeImage(url, ms = SOURCE_TIMEOUT) {
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

/** 并行竞速：最先加载成功的图片 URL 胜出，其余立即中止下载 */
function raceImages(urls) {
  return new Promise((resolve) => {
    let settled = false
    let pending = urls.length
    const images = new Map()

    urls.forEach((url) => {
      const img = new Image()
      images.set(url, img)
      const timer = setTimeout(() => finish(url, false), SOURCE_TIMEOUT)
      img.onload = () => {
        clearTimeout(timer)
        finish(url, true)
      }
      img.onerror = () => {
        clearTimeout(timer)
        finish(url, false)
      }
      img.src = url
    })

    function finish(url, ok) {
      if (settled) return
      if (!ok) {
        pending -= 1
        if (pending === 0) {
          settled = true
          resolve(null)
        }
        return
      }
      settled = true
      // 中止其余仍在下载的图片，节省访客流量
      images.forEach((img, imageUrl) => {
        if (imageUrl !== url) img.src = ''
      })
      resolve(url)
    }
  })
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

/** 出图后后台补拉官方版权信息（可选增强，失败静默） */
async function enrichCopyright(result) {
  if (result.source !== 'bing') return
  const encoded = encodeURIComponent(
    'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN',
  )
  const candidates = [
    `https://api.allorigins.win/raw?url=${encoded}`,
    `https://corsproxy.io/?url=${encoded}`,
  ]
  for (const candidate of candidates) {
    try {
      const ctrl = new AbortController()
      const timer = setTimeout(() => ctrl.abort(), 4000)
      const res = await fetch(candidate, { signal: ctrl.signal })
      clearTimeout(timer)
      if (!res.ok) continue
      const data = await res.json()
      const shot = data?.images?.[0]
      if (!shot?.copyright) continue
      result.copyright = shot.copyright
      writeCache(result)
      apply(result) // 仅更新版权行，背景已是同一张图
      return
    } catch {
      /* 尝试下一候选 */
    }
  }
}

async function initBingHero() {
  const cached = readCache()
  if (cached) {
    apply(cached)
    return
  }

  // 第一阶段：必应镜像直链竞速（5s 内谁先成功用谁）
  const mirrorUrl = await raceImages(SOURCES)
  if (mirrorUrl) {
    const result = { url: mirrorUrl, copyright: '', source: 'bing' }
    writeCache(result)
    apply(result)
    enrichCopyright(result)
    return
  }

  // 第二阶段：按日定种保底图——镜像全挂时它几乎一定可达，单独等待不与之赛跑
  try {
    const url = await probeImage(picsumUrl(), 10000)
    const result = { url, copyright: '', source: 'picsum' }
    writeCache(result)
    apply(result)
  } catch {
    /* 全部失败：保持寒夜渐变背景 */
  }
}

initBingHero()
