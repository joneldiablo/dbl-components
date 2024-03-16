import React from "react";
import Offcanvas from "bootstrap/js/dist/offcanvas";

import eventHandler from "../../functions/event-handler";
import resolveRefs from "../../functions/resolve-refs";
import JsonRender from "../../json-render";
import Component from "../../component";

import schema from "./offcanvas.json";

export default class OffcanvasContainer extends Component {

  static jsClass = 'OffcanvasContainer';
  static defaultProps = {
    ...Component.defaultProps,
    offcanvas: {},
    headerClasses: '',
    closeClasses: '',
    labelClasses: '',
    bodyClasses: '',
    footerClasses: '',
    position: 'start', //start|end|bottom|top
    showClose: true,
    labelTag: 'h5'
  }

  tag = 'aside';
  classes = 'offcanvas d-flex flex-column';
  children = {
    header: [],
    body: [],
    footer: [],
    content: [],
  }


  constructor(props) {
    super(props);
    this.onOffcanvasRef = this.onOffcanvasRef.bind(this);

    this.bsEvents = [
      'show',
      'shown',
      'hide',
      'hidden',
      'hidePrevented'
    ];
    Object.assign(this.state, {
      showOffcanvas: false,
      localClasses: 'offcanvas-' + props.position
    });

    this.schema = resolveRefs(schema.view, {
      definitions: schema.definitions,
      props
    });
    this.jsonRender = new JsonRender(props, this.mutations.bind(this));
  }

  get componentProps() {
    const props = this.props._props || {};
    return Object.assign({
      tabIndex: -1,
      id: this.name,
      'aria-labelledby': this.props.name + '-titleOffcanvas',
      ref: this.onOffcanvasRef
    }, props);
  }

  componentDidMount() {
    const { name } = this.props;
    eventHandler.subscribe('update.' + name, this.onUpdateOffcanvas, this.name);
    this.deleteClasses('offcanvas-start offcanvas-end offcanvas-top offcanvas-bottom');
    this.addClasses('offcanvas-' + this.props.position);
  }

  componentWillUnmount() {
    const { name } = this.props;
    this.destroy();
    eventHandler.unsubscribe('update.' + name, this.name);
  }

  onEvent = (e) => {
    const { name } = this.props;
    eventHandler.dispatch(name, { [name]: e.type.split('.')[0] });
  }

  onClickClose = (e) => {
    this.offcanvas.hide();
  }

  onUpdateOffcanvas = ({ open: showOffcanvas }) => {
    if (!showOffcanvas) {
      return this.offcanvas?.hide();
    }
    this.setState({ showOffcanvas });
  }

  destroy = () => {
    if (this.offcanvas) {
      this.offcanvas?.dispose();
      this.offcanvas = null;
    }
    this.setState({ showOffcanvas: false });
  }

  onOffcanvasRef = (refOriginal) => {
    if (refOriginal) {
      this.ref.current = refOriginal;
      const ref = refOriginal;
      this.offcanvas = new Offcanvas(ref, this.props.offcanvas);
      this.bsEvents.forEach(event => {
        ref.addEventListener(event + '.bs.offcanvas', this.onEvent, false);
      });
      ref.addEventListener('hidden.bs.offcanvas', this.destroy, false);
      this.offcanvas.show();
    }
  }

  get headerContent() {
    return !!this.children.header.length && this.children.header;
  }
  get bodyContent() {
    return !!this.children.body.length && this.children.body;
  }
  get footerContent() {
    return !!this.children.footer.length && this.children.footer;
  }
  get contentOffcanvas() {
    return !!this.children.content.length && this.children.content;
  }

  content(children = this.props.children) {
    this.children = (Array.isArray(children) ? children : [children]).reduce((reducer, child) => {
      if (!child) return reducer;
      // Se separa el contenido según tipo de container header, body, footer o ninguno
      if (['string', 'number', 'boolean'].includes(typeof child)) {
        reducer.body.push(child);
        return reducer;
      }
      const childConf = (!(child.props?.style && child.props.style['--component-name'])
        ? child : child.props.children).props;
      const container = (childConf && reducer[childConf.container]) || reducer.content;
      container.push(child);
      return reducer;
    }, { header: [], body: [], footer: [], content: [] });
    return this.jsonRender.buildContent(this.schema);
  }

  render() {
    return this.state.showOffcanvas ? super.render() : <React.Fragment />;
  }

  mutations(name, conf) {
    const rn = name.replace(this.props.name + '-', '');
    switch (rn) {
      case 'headerOffcanvas': {
        return {
          active: this.props.showClose || !!this.props.label || !!this.headerContent,
          classes: [conf.classes, this.props.headerClasses]
        }
      }
      case 'titleOffcanvas': {
        return {
          active: !!this.props.label,
          tag: this.props.labelTag,
          classes: [conf.classes, this.props.labelClasses],
          content: this.props.label
        }
      }
      case 'closeOffcanvas': {
        return {
          active: this.props.showClose,
          classes: [conf.classes, this.props.closeClasses]
        }
      }
      case 'contentHO': {
        return {
          active: !!this.headerContent,
          tag: React.Fragment,
          content: this.headerContent
        }
      }
      case 'bodyOffcanvas': {
        return {
          active: !!this.bodyContent,
          classes: [conf.classes, this.props.bodyClasses],
          content: this.bodyContent
        }
      }
      case 'footerOffcanvas': {
        return {
          active: !!this.footerContent,
          classes: [conf.classes, this.props.footerClasses],
          content: this.footerContent
        }
      }
      case 'contentOffcanvas': {
        return {
          active: !!this.contentOffcanvas,
          tag: React.Fragment,
          content: this.contentOffcanvas
        }
      }
      default:
        break;
    }
  }

}