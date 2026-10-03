<template>
  <div class="container not-found">
    <p class="code">404</p>
    <p class="msg">页面被风吹走了，也许它从未存在过。</p>
    <router-link class="text-link" to="/">← 回到首页</router-link>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 90px 24px;
}

.code {
  font-family: var(--font-serif);
  font-size: 4.6rem;
  font-weight: 700;
  color: var(--accent);
  margin: 0;
  line-height: 1.2;
}

.msg {
  color: var(--text-2);
  margin: 12px 0 24px;
}
</style>
