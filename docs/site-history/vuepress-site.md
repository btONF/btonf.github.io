---

---
# 建站历史
## 本地安装node
> 官方文档
> https://vuepress.github.io/zh/guide/getting-started.html

无需安装pnpm，常规npm即可
这里是否使用`pnpm`与`github自动构建`无关

## 本地运行调试
``` shell
npm run docs:dev
```

## 配置
``` js
export default ({
  // 这里定义网站icon
  head: [['link', { rel: 'icon', href: '/images/logo.svg' }]],
  lang: 'zh-CN',
  title: 'doc-ccc2',
  description: '个人知识库',
  theme: defaultTheme({
	  locales :{
		'/':{
			colorMode : 'auto',
			colorModeSwitch:true,
			navbar: [
				// NavbarItem
				{
					text: 'Foo',
					link: '/2222/1.md',
				},
				// NavbarGroup
				{
					text: 'Group',
					children: ['/group/foo.md', '/group/bar.md'],
				},
				// 字符串 - 页面文件路径
				'/bar/README.md',
				],

			sidebar: {
				
			},
			
			logo: '/images/logo.svg',
		}
	  },
  }),
  plugins: [
    searchPlugin({
		locales: {
			'/': {
			  placeholder: '站内搜索',
			},
		  },
          // 可以筛选tags，这个tags是自己定义的
		  getExtraFields: (page) => page.frontmatter.tags ?? [],


    }),
	backToTopPlugin(),
	nprogressPlugin(),
  ],
})

```

## 部署(github pages)
### 官方
> https://vuepress.github.io/zh/guide/deployment.html#github-pages

文件路径：`.github\workflows`
::: details 官方示例
``` yml
name: docs

on:
  # 每当 push 到 main 分支时触发部署
  push:
    branches: [main]
  # 手动触发部署
  workflow_dispatch:

jobs:
  docs:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
        with:
          # “最近更新时间” 等 git 日志相关信息，需要拉取全部提交记录
          fetch-depth: 0

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          # 选择要使用的 pnpm 版本
          version: 8
          # 使用 pnpm 安装依赖
          run_install: true

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          # 选择要使用的 node 版本
          node-version: 18
          # 缓存 pnpm 依赖
          cache: pnpm

      # 运行构建脚本
      - name: Build VuePress site
        run: pnpm docs:build

      # 查看 workflow 的文档来获取更多信息
      # @see https://github.com/crazy-max/ghaction-github-pages
      - name: Deploy to GitHub Pages
        uses: crazy-max/ghaction-github-pages@v2
        with:
          # 部署到 gh-pages 分支
          target_branch: gh-pages
          # 部署目录为 VuePress 的默认输出目录
          build_dir: docs/.vuepress/dist
        env:
          # @see https://docs.github.com/cn/actions/reference/authentication-in-a-workflow#about-the-github_token-secret
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
:::

### 调整
1. 移除pnpm的依赖，github因为源的原因下不下来，改用和本地一样的npm
2. 因为要使用自己的域名跳转过来，需要`CNAME`。原本可以在github上直接配置`CNAME`，但是因为每次都要重新构建，每次构建都会导致cname文件被删除，需要在每次构建的时候生成`CNAME`文件。 vuepress和其插件都有方法去自动`CNAME`,这里选择插件里自带的

::: details 自行调整的配置
``` yml
name: docs

on:
  # 每当 push 到 main 分支时触发部署
  push:
    branches: [main]
  # 手动触发部署
  workflow_dispatch:

jobs:
  docs:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
        with:
          # “最近更新时间” 等 git 日志相关信息，需要拉取全部提交记录
          fetch-depth: 0



      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          # 选择要使用的 node 版本
          node-version: 18
          # 缓存 pnpm 依赖
          cache: npm
      - name: Install Dependent Node Pkgs
        run: npm install
        
      # 运行构建脚本
      - name: Build VuePress site
        run: npm run docs:build

      # 查看 workflow 的文档来获取更多信息
      # @see https://github.com/crazy-max/ghaction-github-pages
      - name: Deploy to GitHub Pages
        uses: crazy-max/ghaction-github-pages@v2
        with:
          # 部署到 gh-pages 分支
          target_branch: gh-pages
          # 部署目录为 VuePress 的默认输出目录
          build_dir: docs/.vuepress/dist
          fqdn: doc.ccc2.icu
        env:
          # @see https://docs.github.com/cn/actions/reference/authentication-in-a-workflow#about-the-github_token-secret
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
:::

### 修改默认分支
上面配置文件指定了默认分支是 ` gh-pages`
需要在仓库的`page`页面去修改默认显示的分支

## 注意事项
1. github不支持跳转链接`XXXX.md`的写法，本地调试支持自动转换为html，如果要部署github需要直接写成`XXXX.html`