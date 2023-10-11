import { defineUserConfig } from 'vuepress'
import { defaultTheme } from 'vuepress'

export default ({
  lang: 'zh-CN',
  title: 'doc-ccc2',
  description: '这是我的第一个 VuePress 站点',
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
      '/': [
        {
          text: 'Guide',
          children: ['/README.md', '/1.md'],
        },
      ],
      '/reference/': [
        {
          text: 'Reference',
          children: ['/reference/cli.md', '/reference/config.md'],
        },
      ],
    },
		  }
	  }

  }),
})
