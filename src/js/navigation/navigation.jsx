import React from "react";
import { NavLink } from "react-router-dom";
import Collapse from "bootstrap/js/dist/collapse";
import parseReact from "html-react-parser";

import eventHandler from "../functions/event-handler";
import Component from "../component";
import Icons from "../media/icons";
import Action from "../actions/action";

export class ToggleTextNavigation extends Action {

  content() {
    return <Icons icon={this.props.icon} />
  }
}

export default class Navigation extends Component {

  static defaultProps = {
    ...Component.defaultProps,
    menu: [],
    caretIcons: ['angle-up', 'angle-down']
  }

  tag = 'nav';

  constructor(props) {
    super(props);
    this.state.localClasses = 'nav';
    this.state.carets = {};
    this.state.open = true;
    this.collapses = {};
  }

  componentDidMount() {
    Object.values(this.collapses).forEach(([ref, item]) => {
      const { caretIcons } = this.props;
      const { carets } = this.state;
      this.collapses[item.name][2] = new Collapse(ref);
      ref.addEventListener('hide.bs.collapse', () => {
        this.setState({
          carets: Object.assign(carets, { [item.name]: caretIcons[0] })
        });
      });

      ref.addEventListener('show.bs.collapse', () => {
        this.setState({
          carets: Object.assign(carets, { [item.name]: caretIcons[1] })
        });
      });
    });
    eventHandler.subscribe(this.props.toggle, this.toggleText);
  }

  componentWillUnmount() {
    eventHandler.unsubscribe(this.props.toggle);
  }

  toggleText = () => {
    this.setState({
      open: !this.state.open
    }, () => eventHandler.dispatch(this.props.name, this.state.open));
  }

  collapseRef = (ref, item) => {
    if (ref) {
      this.collapses[item.name] = [ref, item];
    }
  }

  link = (item, i) => {
    const { caretIcons, linkClasses } = this.props;
    const { carets, open } = this.state;
    carets[item.name] = carets[item.name] || caretIcons[0];

    const iconStyle = {
      style: {
        fill: 'currentColor'
      }
    };
    const innerNode = <span data-bs-toggle="collapse" data-bs-target={'#' + item.name + '-collapse'}>
      {item.content ? parseReact(open ? item.content[0] : item.content[1]) :
        <>
          <Icons icon={item.icon} className="mx-2" {...iconStyle} />
          {open &&
            <>
              <span className="label">{item.label}</span>
              {item.menu?.length &&
                <span className="float-end caret-icon">
                  <Icons icon={carets[item.name]} {...iconStyle} />
                </span>}
            </>}
        </>
      }
    </span>
    const propsLink = {
      to: item.path,
      id: item.name + '-link',
      className: ['nav-link', linkClasses, item.classes].join(' '),
      activeClassName: 'active',
      strict: item.strict,
      exact: item.exact
    }
    return (<React.Fragment key={i + '-' + item.path}>
      {item.path ?
        <NavLink {...propsLink} >
          {innerNode}
        </NavLink> :
        <span id={item.name + '-link'} className={[propsLink.className, 'cursor-pointer'].join(' ')}>{innerNode}</span>
      }
      {item.menu?.length &&
        <div ref={(ref) => this.collapseRef(ref, item)} id={item.name + '-collapse'} className="collapse">
          {item.menu.map(this.link)}
        </div>}
    </React.Fragment>);
  }

  // TODO: agregar submenu dropdown 
  //       y submenu collapsable
  content(children = this.props.children) {
    return (<>
      {this.props.menu.map(this.link)}
      {children}
    </>);
  }

}
