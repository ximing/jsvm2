import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/jsvm2/playground',
    component: ComponentCreator('/jsvm2/playground', 'ac3'),
    exact: true
  },
  {
    path: '/jsvm2/docs',
    component: ComponentCreator('/jsvm2/docs', '924'),
    routes: [
      {
        path: '/jsvm2/docs',
        component: ComponentCreator('/jsvm2/docs', '340'),
        routes: [
          {
            path: '/jsvm2/docs',
            component: ComponentCreator('/jsvm2/docs', '02a'),
            routes: [
              {
                path: '/jsvm2/docs/api/context',
                component: ComponentCreator('/jsvm2/docs/api/context', 'fec'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/jsvm2/docs/api/overview',
                component: ComponentCreator('/jsvm2/docs/api/overview', '6ca'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/jsvm2/docs/api/scope',
                component: ComponentCreator('/jsvm2/docs/api/scope', '592'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/jsvm2/docs/api/vm',
                component: ComponentCreator('/jsvm2/docs/api/vm', '282'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/jsvm2/docs/getting-started/basic-usage',
                component: ComponentCreator('/jsvm2/docs/getting-started/basic-usage', '3dc'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/jsvm2/docs/getting-started/examples',
                component: ComponentCreator('/jsvm2/docs/getting-started/examples', 'c8b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/jsvm2/docs/getting-started/installation',
                component: ComponentCreator('/jsvm2/docs/getting-started/installation', '241'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/jsvm2/docs/intro',
                component: ComponentCreator('/jsvm2/docs/intro', 'e90'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/jsvm2/docs/language-support/es2015',
                component: ComponentCreator('/jsvm2/docs/language-support/es2015', '311'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/jsvm2/docs/language-support/es5',
                component: ComponentCreator('/jsvm2/docs/language-support/es5', 'fff'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/jsvm2/',
    component: ComponentCreator('/jsvm2/', 'a3b'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
