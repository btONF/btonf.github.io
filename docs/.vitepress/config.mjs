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
      { text: '首页', link: '/' },
      { text: '工具收集', link: '/tools-collect/', activeMatch:"/tools-collect/" },
      { text: '更多', items: [
          { text: '关于', link: '/about' },
          { text: '建站记录', link: '/site-history/vitepress-site', activeMatch:"/site-history/" },
        ],
      },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: {
      '/tools-collect/':[
        {
          text: '工具收集',
          items: [
            { text: '开源库',
             items:[
                {text:'LocalSend',link:'./local-send'},
              ]
            },
          ]
        }
      ],
      '/site-history/':[
        {
          text: '建站记录',
          items: [
            { text: 'Vitepress建站', link: './vitepress-site' },
            { text: 'Vuepress建站', link: './vuepress-site' }
          ]
        }
      ],
        '/markdown-examples':[
        {
          text: 'Examples',
          items: [
            { text: 'Markdown Examples', link: '/markdown-examples' },
            { text: 'Runtime API Examples', link: '/api-examples' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/btONF' }
    ],
    search:{
      provider: 'local'
    },
  },
  markdown: {
    lineNumbers: true
  }
})
