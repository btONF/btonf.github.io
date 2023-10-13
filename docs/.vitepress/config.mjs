import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "CCC2-DOCS",
  description: "个人知识库",
  lastUpdated:true,
  head: [['link', { rel: 'icon', href: '/images/logo.svg' }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
     logo: '/images/logo.svg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
    search:{
      provider: 'local'
    },
  },
  markdown: {
    lineNumbers: true
  }
})
