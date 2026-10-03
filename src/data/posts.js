// 本地 Mock 文章数据。
// cover: 0-5 用于挑选卡片封面的渐变色；content 为 Markdown 源文。
// 模板字符串里的代码块围栏使用 \` 转义。
export const posts = [
  {
    slug: 'vue3-composition-api-in-practice',
    title: 'Vue 3 组合式 API 实践：从选项式到组合式的迁移心得',
    date: '2026-09-18',
    category: '前端开发',
    tags: ['Vue', 'JavaScript'],
    cover: 0,
    excerpt:
      '把一个两年老项目从选项式 API 逐步迁移到组合式 API 的过程记录，聊聊组合式 API 在逻辑复用、类型推导上的优势，以及迁移路上踩过的坑。',
    content: `## 为什么要迁移

项目规模变大之后，选项式 API 的痛点越来越明显：一个功能的相关代码被迫分散在 \`data\`、\`methods\`、\`computed\` 等各个选项里，读代码时上下文来回跳转。

组合式 API 允许我们按「逻辑关注点」组织代码，一个功能的响应式状态、副作用和计算属性可以放在一起。

## 基本写法对比

先看选项式的典型写法：

\`\`\`vue
<script>
export default {
  data() {
    return { count: 0 }
  },
  methods: {
    increment() { this.count++ }
  }
}
</script>
\`\`\`

使用组合式 API 后：

\`\`\`vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
const increment = () => count.value++
</script>
\`\`\`

## 逻辑复用：Composables

组合式 API 最大的价值在于逻辑复用。比如把「鼠标位置追踪」抽成一个函数：

\`\`\`js
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)
  const update = (e) => { x.value = e.pageX; y.value = e.pageY }
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))
  return { x, y }
}
\`\`\`

任何组件引入 \`useMouse()\` 即可获得响应式的鼠标坐标，不需要 mixin，也不需要担心命名冲突。

## 迁移建议

1. **不要一次性重写**。新功能用组合式 API，旧代码按模块逐步迁移。
2. **优先抽离无 UI 依赖的逻辑**，如数据获取、表单校验、定时器管理。
3. **保持 composable 单一职责**，一个函数只做一件事，复杂组合放在更上层。

> 迁移不是目的，可维护性才是。如果项目很小、逻辑简单，选项式 API 也完全没问题。`,
  },
  {
    slug: 'css-container-queries',
    title: 'CSS 容器查询：组件级响应式的正确打开方式',
    date: '2026-08-30',
    category: '前端开发',
    tags: ['CSS'],
    cover: 1,
    excerpt:
      '媒体查询只关心视口，组件真正需要的是关心自己所在容器的尺寸。容器查询把响应式的控制权交还给组件本身，这篇文章讲清楚它的用法与实践。',
    content: `## 什么是容器查询

过去我们只能根据「视口」宽度做响应式（媒体查询），但组件真正需要的是根据「自己所在容器」的尺寸来调整布局。同一个卡片组件，放在侧栏里和放在主内容区里，期望的布局是不一样的。

容器查询把响应式的控制权交还给组件本身，这才是真正意义上的组件化响应式设计。

## 基本用法

首先声明一个查询容器：

\`\`\`css
.card-wrap {
  container-type: inline-size;
  container-name: card;
}
\`\`\`

然后在子元素里根据容器宽度应用样式：

\`\`\`css
@container card (min-width: 480px) {
  .card {
    display: flex;
    gap: 16px;
  }
  .card-cover {
    width: 180px;
  }
}
\`\`\`

## 兼容性与实践建议

- Chrome 105+ / Safari 16+ / Firefox 110+ 已全部支持，可以放心在生产环境使用
- 优先给「卡片、侧栏、弹窗」这类会被复用到不同宽度场景的组件使用
- 配合 \`cqw\`、\`cqh\` 等容器单位，还能做出跟随容器缩放的流式排版

> 容器查询 + CSS Grid，基本可以告别过去那种「到处写断点」的响应式方案了。`,
  },
  {
    slug: 'why-i-start-blogging',
    title: '为什么我决定开始写博客',
    date: '2026-07-12',
    category: '随笔',
    tags: ['生活', '写作'],
    cover: 2,
    excerpt:
      '很早就有写点东西的念头，但总觉得自己水平不够。直到重读三年前的笔记，才发现那些以为「人尽皆知」的知识点，如今几乎忘得一干二净。',
    content: `很早就有写点东西的念头，但总觉得自己水平不够，写出来的东西「不值一读」。直到去年重读自己三年前的笔记，才发现那些当时以为「人尽皆知」的知识点，如今几乎忘得一干二净。

写作首先是写给自己的。

## 写作的三个收益

1. **梳理思路**。很多问题在脑子里是一团浆糊，落到文字上才被迫想清楚。
2. **留下痕迹**。笔记会丢，记忆会模糊，但博客一直在那里。
3. **获得反馈**。偶尔有读者留言指出错误或补充思路，比自己闷头学快乐得多。

> 我们的书架上都有些读了一半的书，但没有人会因此指责我们。博客也一样，它只是思考的现场，不必是思想的完成品。

今年给自己定了一个小目标：每月至少输出一篇。不求深刻，但求诚实。`,
  },
  {
    slug: 'designing-restful-api',
    title: '设计一套优雅的 RESTful API：从资源到响应结构',
    date: '2026-06-25',
    category: '后端',
    tags: ['API', '架构'],
    cover: 3,
    excerpt:
      'URL 用名词复数、动作交给 HTTP 方法、状态码要诚实——把这些原则内化成团队的肌肉记忆，接口文档就省了一半。',
    content: `## 从资源出发

RESTful 的核心是把一切抽象为**资源**：用 URL 表示资源，用 HTTP 方法表达对资源的操作。

| 操作     | 方法   | 示例            |
| -------- | ------ | --------------- |
| 查询列表 | GET    | \`/articles\`     |
| 查询单个 | GET    | \`/articles/42\`  |
| 创建     | POST   | \`/articles\`     |
| 全量更新 | PUT    | \`/articles/42\`  |
| 局部更新 | PATCH  | \`/articles/42\`  |
| 删除     | DELETE | \`/articles/42\`  |

## 几条实战原则

1. **URL 用名词复数**，动作交给 HTTP 方法：用 \`DELETE /articles/42\` 而不是 \`/deleteArticle?id=42\`。
2. **层级表达从属关系**，但不要超过两层：\`/users/42/articles\` 可以，再深就该用查询参数了。
3. **过滤、分页、排序放查询参数**：\`/articles?page=2&size=10&sort=-created_at\`。
4. **状态码要诚实**：参数错误回 400，未登录回 401，没权限回 403，资源不存在回 404，不要一律 200。

## 统一响应结构

业务层建议返回统一信封，方便前端统一处理：

\`\`\`json
{
  "code": 0,
  "message": "ok",
  "data": {
    "list": [],
    "total": 0,
    "page": 1,
    "size": 10
  }
}
\`\`\`

> 规范的价值不在于「标准」本身，而在于团队成员不需要猜测就能写对接口。`,
  },
  {
    slug: 'git-rebase-guide',
    title: 'Git Rebase 使用指南：让提交历史干净起来',
    date: '2026-05-20',
    category: '工具效率',
    tags: ['Git'],
    cover: 4,
    excerpt:
      'rebase 和 merge 解决的是同一个问题——整合分支——但方式完全不同。搞清楚三个最常用的场景和一条黄金法则，就能放心用起来。',
    content: `## rebase 是什么

\`git rebase\` 直译是「变基」：把一串提交摘下来，接到另一个基点上重放。它和 \`merge\` 解决的是同一个问题——整合两条分支——但方式完全不同：

- **merge**：把两条分支的历史合并在一起，产生一个合并提交，历史是「真实发生过的」
- **rebase**：把提交重放一遍，历史是线性的、干净的

## 最常用的三个场景

**1. 同步主干，保持线性历史**

\`\`\`bash
git checkout feature/login
git fetch origin
git rebase origin/main
\`\`\`

**2. 交互式变基，整理提交**

\`\`\`bash
git rebase -i HEAD~5
\`\`\`

常用指令：

- \`pick\`：保留该提交
- \`squash\`：与上一个提交合并
- \`reword\`：修改提交信息
- \`drop\`：丢弃该提交

**3. 摘取提交换基**：想把 feature-a 里的提交挪到 feature-b 上时，\`git rebase --onto feature-b feature-a\` 可以精确控制重放范围。

## 黄金法则

> **不要对已经推送到公共分支的提交做 rebase。**

rebase 会改写提交历史。如果你 rebase 了别人正在基于其工作的分支，协作者的本地历史会和远端冲突，整个团队都要花时间收拾残局。

万一真的 rebase 了公共分支，可以用 \`git reflog\` 找到变基前的 HEAD，然后 \`git reset --hard\` 回去。`,
  },
  {
    slug: 'tokyo-travel-notes',
    title: '东京五日行记：樱吹雪、平交道与居酒屋',
    date: '2026-04-02',
    category: '随笔',
    tags: ['旅行'],
    cover: 5,
    excerpt:
      '四月初的东京，正好赶上樱花尾巴。五天行程不紧不慢，记录一些印象深刻的片段：镰仓的平交道、表参道的安静、居酒屋的另一个世界。',
    content: `四月初去了一趟东京，正好赶上樱花尾巴。五天行程不紧不慢，记录一些印象深刻的片段。

## 行程速览

- **Day 1**：抵达成田，傍晚在浅草寺附近散步，雷门夜景比白天好看
- **Day 2**：上野公园看樱吹雪，下午阿美横町吃小吃
- **Day 3**：镰仓一日游，灌篮高手平交道打卡的人排到了坡下
- **Day 4**：涩谷、原宿、表参道，从吵闹走到安静只隔一条街
- **Day 5**：筑地外市场吃早餐，然后心满意足地回家

## 一些碎碎念

东京是个矛盾的城市：地铁里安静得能听见呼吸，居酒屋里热闹得像另一个世界；便利店精致得不像便利店，垃圾桶却少得让人绝望。

最难忘的是镰仓的海。坐在海边台阶上吹了半小时风，什么都没想，大概是这趟旅行最奢侈的时刻。

下次再去，想在海边住一晚，早上看一次海上的日出。`,
  },
  {
    slug: 'typescript-type-gymnastics',
    title: 'TypeScript 类型体操入门：从手写 Pick 开始',
    date: '2026-03-15',
    category: '前端开发',
    tags: ['TypeScript'],
    cover: 1,
    excerpt:
      '类型体操听起来吓人，其实入门只需要理解几个基础工具类型是怎么实现的。从 keyof、映射类型、infer 三个知识点出发，逐步解锁常用套路。',
    content: `「类型体操」听起来吓人，其实入门只需要理解几个基础工具类型是怎么实现的。

## 从 Pick 开始

\`\`\`ts
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}
\`\`\`

拆开看就三个知识点：

1. \`keyof T\`：取出对象类型的所有键，组成联合类型
2. \`K extends keyof T\`：约束 K 必须是 T 的键的子集
3. \`[P in K]\`：映射类型，遍历 K 中的每个键

## 常用技巧

**条件类型 + infer 推断**：

\`\`\`ts
type Unpack<T> = T extends Promise<infer V> ? V : T

type A = Unpack<Promise<string>>  // string
type B = Unpack<number>           // number
\`\`\`

**never 的过滤效果**（联合类型的分配律）：

\`\`\`ts
type NonNull<T> = T extends null | undefined ? never : T

type C = NonNull<string | null | number>  // string | number
\`\`\`

## 什么时候该用

类型体操是工具不是炫技。业务代码里 80% 的场景只需要泛型约束和 \`Partial\`、\`Pick\`、\`Record\` 这些内置工具类型，剩下的 20% 再考虑自定义映射类型。`,
  },
  {
    slug: 'reading-notes-2026-q1',
    title: '第一季度读书笔记：置身事内、纳瓦尔与长日将尽',
    date: '2026-02-28',
    category: '读书',
    tags: ['阅读'],
    cover: 2,
    excerpt:
      '一个季度读完三本书：一本理解中国经济的入门地图，一本需要反复读的财富与幸福指南，一本克制到极致的诺贝尔奖小说。',
    content: `第一季度一共读完三本书，记录一点随想。

## 《置身事内》：理解中国经济的入门地图

兰小欢这本书最大的优点是**不堆术语**，从土地财政讲到招商引资，把地方政府的行为逻辑讲得明明白白。读完再看新闻里的「专项债」「城投」，终于不是天书了。

## 《纳瓦尔宝典》：一本需要反复读的书

道理都不新，但组合得很好。「用判断力赚钱」「把自己产品化」这几章，值得每个做产品、写代码的人读三遍。

## 《长日将尽》：克制到极致的叙述

石黑一雄写了一个管家的一生，几乎没有情节，却让人合上书后怅然若失。「尊严」和「错过」这两个词，很冷。

## 下季度计划

- 《翦商》
- 《代码之外的生存指南》（重读）
- 找一本轻松的小说调剂`,
  },
  {
    slug: 'vite-plugin-writing',
    title: '手写一个 Vite 插件：从最小可用到自动注入版本号',
    date: '2026-01-10',
    category: '前端开发',
    tags: ['Vite', '工程化'],
    cover: 4,
    excerpt:
      'Vite 插件本质上就是一个带钩子的对象，比想象中简单得多。从十几行的最小插件开始，理解 transformIndexHtml、configResolved 等常用钩子。',
    content: `Vite 插件本质上就是一个带钩子的对象，比想象中简单得多。

## 最小可用插件

\`\`\`js
// vite-plugin-logo.js
export default function vitePluginLogo() {
  return {
    name: 'vite-plugin-logo',
    transformIndexHtml(html) {
      return html.replace('</body>', '<!-- powered by my plugin --></body>')
    },
  }
}
\`\`\`

在 \`vite.config.js\` 里注册即可：

\`\`\`js
import { defineConfig } from 'vite'
import vitePluginLogo from './vite-plugin-logo.js'

export default defineConfig({
  plugins: [vitePluginLogo()],
})
\`\`\`

## 常用钩子

- \`configResolved\`：读取最终配置，常用来拿环境信息
- \`transform(code, id)\`：转换模块代码，配合正则可以定制编译产物
- \`transformIndexHtml\`：注入脚本或标签
- \`configureServer\`：往 dev server 加自定义中间件

## 一个实用例子：自动注入版本号

\`\`\`js
export default function versionPlugin() {
  let version = ''
  return {
    name: 'vite-plugin-version',
    configResolved(config) {
      version = config.env.MODE
    },
    transformIndexHtml() {
      return [{ tag: 'meta', attrs: { name: 'app-version', content: version } }]
    },
  }
}
\`\`\`

写插件的过程也是理解构建工具的过程。下次遇到「构建时做点小改动」的需求，先想想能不能用一个十几行的插件解决。`,
  },
]
