import { ref } from 'vue'

// 模块级单例：任意组件拿到的是同一份主题状态
const theme = ref(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = theme.value
    localStorage.setItem('blog-theme', theme.value)
  }

  return { theme, toggleTheme }
}
