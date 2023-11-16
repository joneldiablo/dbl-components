import React from "react";
import eventHandler from "../functions/event-handler";
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

  onClickTab = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: averiguar porqué se pasa el evento onClick al container =/
    const { target } = e;
    const tabName = target.getAttribute('index');
    if (!tabName) return;
    const { name } = this.props;
    this.setState({
      value: tabName,
      i: parseInt(target.getAttribute('index'))
    });
    eventHandler.dispatch(name, { [name]: tabName });
  }

  get tabNode() {
    const { children, navClasses, tabClasses } = this.props;
    const { i: index } = this.state;
    const cn = ['nav', navClasses];
    return (<nav>
      <div className={cn.join(' ')}>
        {children.map((tab, i) => {
          const { label, name, tabClasses: tabC } = (tab.type !== 'section' ? tab :
            tab.props.children).props;
          const cnTab = ['nav-link', tabClasses, tabC];
          if (index == i) cnTab.push('active');
          return <span key={i} className={cnTab.join(' ')}
            index={i} name={name} onClick={this.onClickTab} style={{ cursor: 'pointer' }}>
            {label}
          </span>
        })}
      </div>
    </nav>);
  }

  get activeTabNode() {
    const { children, containerClasses } = this.props;
    const { i } = this.state;
    return (<div className={containerClasses}>{children[i]}</div>);
  }

  content() {
    if (!this.breakpoint) return this.waitBreakpoint;
    return (<>
      {this.tabNode}
      {this.activeTabNode}
    </>);
  }
}