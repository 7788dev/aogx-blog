// 背景图策略（速度优先）：
// 每日背景由定时任务（.github/workflows/daily-bg.yml）烘焙为站内资源
// public/images/daily-bg.jpg —— 与站点同源同速，head 里有 preload，进站几乎瞬时显示；
// 版权信息读取同源 meta JSON；若站内图缺失（新仓库首次部署前），
// 退回多源竞速：必应镜像直链 → Picsum 按日定种保底图。

const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '')
const DAILY_URL = `${BASE}/images/daily-bg.jpg`
const DAILY_META_URL = `${BASE}/images/daily-bg.json`
const FALLBACK_SOURCES = [
  'https://bing.img.run/1920x1080.php',
  'https://api.vvhan.com/api/bingimg',
  'https://api.dujin.org/bing/1920.php',
]
const SOURCE_TIMEOUT = 5000

/** Picsum 按当天日期定种：同一天稳定同一张 */
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

/** 并行竞速：最先加载成功者胜出，其余立即中止下载 */
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
      images.forEach((img, imageUrl) => {
        if (imageUrl !== url) img.src = ''
      })
      resolve(url)
    }
  })
}

function apply(url, copyright) {
  const photo = document.getElementById('hero-photo')
  const credit = document.getElementById('hero-credit')
  if (!photo) return
  photo.style.backgroundImage = `url("${url}")`
  photo.closest('.hero')?.classList.add('has-photo')
  if (credit && copyright) {
    credit.textContent = `必应每日一图 · ${copyright}`
    credit.hidden = false
  }
}

async function initBingHero() {
  // 首选：站内烘焙的每日背景（同源 + preload，秒级）
  try {
    await probeImage(DAILY_URL, 8000)
    apply(DAILY_URL)
    fetch(DAILY_META_URL)
      .then((r) => (r.ok ? r.json() : null))
      .then((meta) => {
        if (meta?.copyright) apply(DAILY_URL, meta.copyright)
      })
      .catch(() => {})
    return
  } catch {
    /* 站内图缺失，走回退竞速 */
  }

  // 回退：必应镜像直链竞速 → Picsum 保底
  const mirrorUrl = await raceImages(FALLBACK_SOURCES)
  if (mirrorUrl) {
    apply(mirrorUrl)
    return
  }
  try {
    apply(await probeImage(picsumUrl(), 10000))
  } catch {
    /* 全部失败：保持寒夜渐变背景 */
  }
}

initBingHero()
