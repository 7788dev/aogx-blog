/** 拼接站点 base 路径（GitHub Pages 项目站点部署在 /aogx-blog/ 子路径下） */
export function withBase(path = '/') {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '')
  const clean = path.replace(/^\/+/, '')
  // 目录路径补尾斜杠（避免托管平台对无斜杠目录 URL 的 404）；带扩展名的资源保持原样
  const normalized =
    clean === '' || clean.endsWith('/') || /\.[a-z0-9]+$/i.test(clean) ? clean : `${clean}/`
  return `${base}/${normalized}`
}
