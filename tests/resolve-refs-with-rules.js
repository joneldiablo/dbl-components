#!/usr/bin/env node

import resolveRefs from '../src/js/functions/resolve-refs.js';

const schema = {
  template: '$definitions/card',
  definitions: {
    card: {
      component: 'CardContainer',
      name: '$nameCard',
      content: [
        {
          tag: 'h4',
          name: '$nameFullname',
          classes: 'mb-0',
          content: ['$user/name', ' ', '$user/lastname']
        },
        {
          tag: 'small',
          name: '$nameIcons',
          classes: 'mb-3',
          content: '$definitions/icons'
        },
        {
          component: 'ListContainer',
          name: '$nameTools',
          content: '$definitions/tools'
        }
      ]
    },
    icons: {
      component: 'Icons',
      name: '$nameIcon',
      icon: '$icon',
      classes: 'mx-1'
    },
    tools: {
      name: '$nameTool',
      tag: 'p',
      content: ['$tool/name', ' - ', '$tool/time']
    }
  },
  data: [
    {
      id: 1,
      name: 'fulano',
      lastname: 'rdz',
      icons: ['home', 'gear', 'pipe']
    },
    {
      id: 2,
      name: 'jon',
      lastname: 'doe',
      icons: ['check', 'close', 'user-o'],
      tools: [{ id: 1, name: 'pickaxe', time: 30 }, { id: 2, name: 'axe', time: 10 }]
    }
  ]
};

const rules = {
  '$definitions/card': ['iterate', '$data', 'user'],
  '$nameCard': ['join', '$user/id', 'Card'],
  '$nameFullname': ['join', '$user/id', 'Fullname'],
  '$nameIcons': ['join', '$user/id', 'Icons'],
  '$definitions/icons': ['iterate', '$user/icons', 'icon'],
  '$nameIcon': ['join', '$user/id', '$icon', 'Icon'],
  '$nameTools': ['join', '$user/id', 'Tools'],
  '$definitions/tools': ['iterate', '$user/tools', 'tool'],
  '$nameTool': ['join', '$user/id', '$tool/id', 'Tool']
}

const r = resolveRefs(schema.template, schema, rules);

console.log(JSON.stringify(r, null, 2));