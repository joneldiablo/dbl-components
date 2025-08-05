require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-react'],
  extensions: ['.js', '.jsx'],
  ignore: [/node_modules/],
});

const assert = require('assert');
const path = require('path');
const { JSDOM } = require('jsdom');
const React = require('react');
const ReactDOM = require('react-dom/client');
const { MemoryRouter, useNavigate } = require('react-router-dom');

// Stub controllers to avoid loading the full library during tests
const controllersPath = path.resolve(__dirname, '../src/js/controllers.js');
const stubControllers = {
  Controller: (props) => React.createElement('div', null, props.children),
};
stubControllers.addControllers = (c) => Object.assign(stubControllers, c);
require.cache[controllersPath] = {
  id: controllersPath,
  filename: controllersPath,
  loaded: true,
  exports: stubControllers,
};

const SchemaController = require('../src/js/react-router-schema/react-router-schema.jsx').default;
const { addControllers } = require('../src/js/controllers');

let rootMounts = 0;
let rootUnmounts = 0;
let childMounts = 0;

function RootController(props) {
  React.useEffect(() => {
    rootMounts++;
    return () => {
      rootUnmounts++;
    };
  }, []);
  return React.createElement('div', null, props.children);
}

function ChildController() {
  React.useEffect(() => {
    childMounts++;
  }, []);
  return React.createElement('div');
}

addControllers({ RootController, ChildController });

const routes = [
  {
    path: '/',
    name: 'root',
    component: 'RootController',
    routes: [
      { path: 'child', name: 'child', component: 'ChildController' },
    ],
  },
];

function TestWrapper() {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate('/child');
  }, [navigate]);
  return React.createElement(SchemaController, { routes });
}

const dom = new JSDOM('<!doctype html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;

const container = document.createElement('div');
document.body.appendChild(container);
const root = ReactDOM.createRoot(container);

root.render(
  React.createElement(MemoryRouter, { initialEntries: ['/'] }, React.createElement(TestWrapper))
);

setTimeout(() => {
  assert.strictEqual(rootMounts, 1, 'Root should mount once');
  assert.strictEqual(rootUnmounts, 0, 'Root should remain mounted');
  assert.strictEqual(childMounts, 1, 'Child should mount once');
  root.unmount();
  console.log('react-router-schema tests passed');
}, 50);
