import React from "react";

import { eventHandler } from "dbl-utils";

import Container from "./container";

export default class TabsContainer extends Container {

  static jsClass = 'TabsContainer';
  static defaultProps = {
    ...Container.defaultProps,
    fullWidth: true
  }

  constructor(props) {
    super(props);
    this.state.i = 0;
  }

  componentDidMount() {
    super.componentDidMount();
    eventHandler.subscribe(`update.${this.props.name}`, this.onUpdate.bind(this), this.name);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    eventHandler.unsubscribe(`update.${this.props.name}`, this.name);
  }

  onUpdate({ active }) {
    this.setState({
      value: active + '',
      i: parseInt(active)
    });
  }

  onClickTab = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: averiguar porqué se pasa el evento onClick al container =/
    const { target } = e;
    const tabName = target.getAttribute('index');
    if (!tabName) return;
    this.setState({
      value: tabName,
      i: parseInt(tabName)
    });
    const { name } = this.props;
    eventHandler.dispatch(name, { [name]: tabName });
  }

  get tabNode() {
    const { children, navClasses, tabClasses } = this.props;
    const { i: index } = this.state;
    const cn = ['nav', navClasses];
    return (React.createElement('nav', {},
      React.createElement('div',
        { className: cn.flat().join(' ') },
        ...children.map((tab, i) => {
          if (!tab) return false;

          const { label, name, tabClasses: tabC } =
            (!(tab.props.style && tab.props.style['--component-name'])
              ? tab : tab.props.children).props;

          const cnTab = ['nav-link'];
          if (tabClasses) cnTab.push(tabClasses);
          if (tabC) cnTab.push(tabC);
          if (index == i) cnTab.push('active');

          return React.createElement('span',
            {
              key: i, className: cnTab.flat().join(' '),
              index: i, name: name, onClick: this.onClickTab, style: { cursor: 'pointer' }
            },
            label
          )
        }).filter(t => !!t)
      )
    ));
  }

  get activeTabNode() {
    const { children, containerClasses } = this.props;
    const { i } = this.state;
    return (React.createElement('div', { className: containerClasses }, children[i]));
  }

  content() {
    if (!this.breakpoint) return this.waitBreakpoint;
    return (React.createElement(React.Fragment, {},
      this.tabNode,
      this.activeTabNode
    ));
  }
}