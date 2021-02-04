import React from 'react';
import { HashRouterSchema } from '../../src/js/react-router-schema/react-router-schema';
//import * as ButtonStories from './Button.stories';

export default {
  title: 'sites/cvm',
  component: HashRouterSchema
}

const Template = (args => <HashRouterSchema {...args} />);

const schema = require('./schemas/cvm.json');
const theme = require('./scss/cvm.scss');
export const cvm = Template.bind({});
cvm.args = schema;
cvm.args.theme = theme;