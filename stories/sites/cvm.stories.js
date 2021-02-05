import React from 'react';
import { HashRouterSchema } from '../../src/js/react-router-schema/react-router-schema';
//import * as ButtonStories from './Button.stories';

export default {
  title: 'sites/cvm',
  component: HashRouterSchema
}

const Template = (args => {
  require('./scss/cvm.scss');
  return <HashRouterSchema {...args} />
});

const schema = require('./schemas/cvm.json');
export const cvm = Template.bind({});
cvm.args = schema;
//cvm.args.theme = theme;