import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'LMF Blog',
  description: 'A personal technical blog for algorithms, C++, projects, and notes.',
  cleanUrls: true,
  markdown: {
    math: true
  },
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Algorithm', link: '/algorithm/' },
      { text: 'C++', link: '/cpp/' },
      { text: '题解', link: '/题解/' },
      { text: 'Projects', link: '/projects/' },
      { text: 'Posts', link: '/posts/' },
      { text: 'About', link: '/about' }
    ],
    sidebar: [
      {
        text: 'Start',
        items: [
          { text: 'Home', link: '/' },
          { text: 'About', link: '/about' }
        ]
      },
      {
        text: 'Notes',
        items: [
          { text: 'Algorithm Notes', link: '/algorithm/' },
          { text: 'C++ Study Notes', link: '/cpp/' },
          { text: '题解', link: '/题解/' }
        ]
      },
      {
        text: 'Writing',
        items: [
          { text: 'Project Records', link: '/projects/' },
          { text: 'General Posts', link: '/posts/' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/' }
    ],
    search: {
      provider: 'local'
    }
  }
})
