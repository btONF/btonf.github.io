import { defineUserConfig } from 'vuepress'
import { defaultTheme } from 'vuepress'
import { searchPlugin } from '@vuepress/plugin-search'
import { backToTopPlugin } from '@vuepress/plugin-back-to-top'
import { nprogressPlugin } from '@vuepress/plugin-nprogress'

export default ({
  head: [['link', { rel: 'icon', href: '/images/logo.svg' }]],
  lang: 'zh-CN',
  title: 'doc-ccc2',
  description: '个人知识库',
  theme: defaultTheme({
	  locales :{
		'/':{
			colorMode : 'dark',
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
		  getExtraFields: (page) => page.frontmatter.tags ?? [],


    }),
	backToTopPlugin(),
	nprogressPlugin(),
  ],
})
