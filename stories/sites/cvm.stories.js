import React from 'react';
import { HashRouterSchema } from '../../src/js/react-router-schema/react-router-schema';
//import * as ButtonStories from './Button.stories';

export default {
  title: 'sites/cvm',
  component: HashRouterSchema
}

const Template = (args => <HashRouterSchema {...args} />);

export const cvm = Template.bind({});
cvm.args = require('./schemas/cvm.json');
cvm.args.theme = require('./scss/cvm.scss');