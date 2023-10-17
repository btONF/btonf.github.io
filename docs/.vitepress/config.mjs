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
    outline: {
      level:[1,2,3,4],
      label: '大纲',
    },
    lastUpdated:{
      text:'最后更新时间',
    },
    docFooter: {
      next:'下一页',
      prev:'上一页',
    },
    returnToTopLabel:'返回顶部',
    nav: [
      { text: '首页', link: '/' },
      { text: '工具收集', link: '/tools-collect/', activeMatch:"/tools-collect/" },
      { text: '代码', items:[
          {text:'android',link:'/android/',activeMatch:"/android/"},
          {text:'python',link:'/python/',activeMatch:"/python/"}
      ]},
      { text: '更多', items: [
          { text: '关于', link: '/about' },
          { text: '建站记录', link: '/site-history/vitepress-site', activeMatch:"/site-history/" },
        ],
      },

    ],

    sidebar: {
      '/tools-collect/':[
        {
          text: '工具收集',
          collapsed:false,
          items: [
            {text:'介绍',link:'/tools-collect/'},
            { text: '开源库',
             items:[
                {text:'LocalSend',link:'/tools-collect/local-send'},
                {text:'Arcgis',link:'/tools-collect/map/arcgis'},
              ]
            },
          ]
        }
      ],
      '/site-history/':[
        {
          text: '建站记录',
          collapsed:false,
          items: [

            { text: 'Vitepress', link: '/site-history/vitepress-site' },
            { text: 'Vuepress', link: '/site-history/vuepress-site' },
            { text: '配置cloudflare', link: '/site-history/cf-githubpages' },
          ]
        }
      ],
      '/python/':[
        {
          text: 'python',
          collapsed:false,
          items: [
            { text: '介绍', link: '/python/' },
            { text: '签到', link: '/python/sign-in' },
            { text: '转大写', link: '/python/uppercase' }
          ]
        }
      ],
      '/android/':[
        {
          text: 'Android',
          collapsed:false,
          items: [
            { text: '介绍', link: '/android/' },
            { text: '奇思妙想', items:[
              {text:'快捷修改值',link:'/android/fast-change-value'},

            ] },
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
    lineNumbers: true,
    anchor: { level: [1, 2,3,4], },
  }
})
