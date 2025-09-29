import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'JSVM2',
  tagline: '基于 JavaScript 实现的 JavaScript 解释器',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://ximing.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/jsvm2/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'ximing', // Usually your GitHub org/user name.
  projectName: 'jsvm2', // Usually your repo name.
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/ximing/jsvm2/tree/master/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'JSVM2',
      logo: {
        alt: 'JSVM2 Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: '文档',
        },
        {to: '/playground', label: 'Playground', position: 'left'},
        {
          href: 'https://github.com/ximing/jsvm2',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '文档',
          items: [
            {
              label: '快速开始',
              to: '/docs/intro',
            },
            {
              label: 'API 参考',
              to: '/docs/api/overview',
            },
          ],
        },
        {
          title: '社区',
          items: [
            {
              label: 'Issues',
              href: 'https://github.com/ximing/jsvm2/issues',
            },
            {
              label: 'Discussions',
              href: 'https://github.com/ximing/jsvm2/discussions',
            },
          ],
        },
        {
          title: '更多',
          items: [
            {
              label: 'Playground',
              to: '/playground',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/ximing/jsvm2',
            },
            {
              label: 'NPM',
              href: 'https://www.npmjs.com/package/jsvm2',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} JSVM2. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;