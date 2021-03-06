import React from "react";
import { NavLink } from "react-router-dom";
import Collapse from "bootstrap/js/dist/collapse"
import Icons from "../media/icons";
import Component from "../component";

export class ToggleTextNavigation extends Component {
  content() {
    const { icon } = this.props;
    return <Icons icon={icon} />
  }
}

export default class Navigation extends Component {

  static defaultProps = {
    ...Component.defaultProps,
    menu: [],
    caretIcons: ['angle-up', 'angle-down']
  }

  constructor(props) {
    super(props);
    this.state.localClasses = 'nav';
    this.state.carets = {};
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
  }

  collapseRef = (ref, item) => {
    if (ref) {
      this.collapses[item.name] = [ref, item];
    }
  }

  link = (item, i) => {
    const { caretIcons, linkClasses } = this.props;
    const { carets } = this.state;
    carets[item.name] = carets[item.name] || caretIcons[0];
    const cnLink = ['nav-link', linkClasses, item.classes];
    const propsLink = {
      to: item.path,
      id: item.name + '-link',
      className: cnLink.join(' '),
      activeClassName: 'active',
      strict: item.strict,
      exact: item.exact
    }
    const iconStyle = {
      style: {
        fill: 'currentColor'
      }
    };
    const innerNode = <span data-bs-toggle="collapse" data-bs-target={'#' + item.name + '-collapse'}>
      <Icons icon={item.icon} className="mx-2" {...iconStyle} />
      <span className="label">{item.label}</span>
      {item.menu?.length &&
        <span className="float-end caret-icon">
          <Icons icon={carets[item.name]} {...iconStyle} />
        </span>}
    </span>
    return (<React.Fragment key={i + '-' + item.path}>
      {item.path ?
        <NavLink {...propsLink} >
          {innerNode}
        </NavLink> :
        <span id={item.name + '-link'} className={[...cnLink, 'cursor-pointer'].join(' ')}>{innerNode}</span>
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

  // TODO: buscar la forma de no repetir este frgamento de código
  //       permitir cambiar la etiqueta contenedora
  render() {
    let { classes, style } = this.props;
    let { localClasses, localStyles } = this.state;
    let cn = [this.constructor.name, this.name(), localClasses, classes].join(' ');
    const s = Object.assign({}, localStyles, style);
    return <nav className={cn} style={s} ref={this.ref}>
      {this.content()}
    </nav>
  }
}
