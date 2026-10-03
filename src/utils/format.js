/** 2026-09-18 风格的日期（date 为 Date 对象） */
export function formatDate(date) {
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`
}

/** '09-18' 形式的月-日（列表行右侧使用，等宽数字） */
export function monthDay(date) {
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${m}-${d}`
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
