/** 把 '2026-09-18' 格式化成 '2026 年 9 月 18 日' */
export function formatDate(date) {
  const [y, m, d] = date.split('-').map(Number)
  return `${y} 年 ${m} 月 ${d} 日`
}

/** 按中文阅读速度（约 400 字/分钟）估算阅读时长 */
export function readingMinutes(text) {
  const chars = text.replace(/\s/g, '').length
  return Math.max(1, Math.round(chars / 400))
}

/** 估算字数 */
export function charCount(text) {
  return text.replace(/\s/g, '').length
}
