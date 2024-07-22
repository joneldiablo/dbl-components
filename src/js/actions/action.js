import PropTypes from "prop-types";

import { ptClasses } from "../prop-types";
import JsonRender from "../json-render";
import resolveRefs from "../functions/resolve-refs";
import eventHandler from "../functions/event-handler";
import Component from "../component";

export default class ActionComponent extends Component {

  static jsClass = 'Action';
  static propTypes = {
    ...Component.propTypes,
    classButton: PropTypes.bool,
    close: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    disabled: PropTypes.bool,
    form: PropTypes.string,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    iconClasses: ptClasses,
    iconProps: PropTypes.object,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    open: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    status: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    statusClasses: PropTypes.objectOf(ptClasses),
    statusIcons: PropTypes.objectOf(PropTypes.string),
    to: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.any,
  }
  static defaultProps = {
    ...Component.defaultProps,
    type: 'button',
    classButton: true,
    open: false,
    close: false,
    statusIcons: {
      success: 'check',
      error: 'x',
      warning: 'exclamation',
      loading: 'spinner'
    },
    statusClasses: {
      success: 'text-bold text-success',
      error: 'text-bold text-danger',
      warning: 'text-bold text-warning',
      loading: 'spinner'
    },
    iconClasses: '',
    iconProps: {}
  };
  static schemaContent = {
    actionIcon: {
      name: ["$props/name", "actionIcon"],
      component: "Icons",
      icon: "$props/icon",
      style: {
        width: "var(--bs-btn-font-size)"
      }
    },
    actionContent: {
      name: ["$props/name", "actionContent"],
      tag: 'span'
    },
    actionStatus: {
      name: ["$props/name", "actionStatus"],
      component: 'Icons',
      icon: "$state/status",
      classes: "float-end"
    }
  };

  tag = 'button';
  classes = 'd-inline-flex align-items-center justify-content-center';

  constructor(props) {
    super(props);
    this.state.localClasses = props.classButton ? 'btn' : '';
    this.onClick = this.onClick.bind(this);
    this.eventHandlers.onClick = this.onClick;
    this.schema = resolveRefs(ActionComponent.schemaContent, { props });
    this.jsonRender = new JsonRender({
      ...props
    }, this.mutations.bind(this));
  }

  onClick(e) {
    e.stopPropagation();
    if (this.props.type === 'link') {
      const { history, location, to } = this.props;
      let path = to;
      //FIX: react router tiene un error al navegar de forma relativa
      if (!path.startsWith('/')) {
        const tmp = location.pathname.replace(/\/$/, '').split('/');
        const actual = tmp.pop();
        if (path.startsWith('..')) {
          path = `../${tmp.pop()}/${path.replace(/\.\.\/?/, '')}`;
        } else if (path.startsWith('.')) {
          path = path.replace('.', actual);
        } else {
          path = `./${actual}/${path}`;
        }
      }
      history.push(path);
    }
    if (this.props.open) {
      eventHandler.dispatch('update.' + this.props.open, { open: true });
    }
    if (this.props.close) {
      eventHandler.dispatch('update.' + this.props.close, { open: false });
    }
    const { value, name, id } = this.props;
    let dispatch = name;
    if (value || id) {
      dispatch = { [name]: value, id }
    }
    eventHandler.dispatch(name, dispatch);
  }

  get componentProps() {
    const { type: prevType, disabled, form, _props = {} } = this.props;
    const type = prevType === 'link' ? 'button' : prevType;
    return { type, disabled, ..._props, form: form ? form + '-form' : undefined };
  }

  content() {
    return this.jsonRender.buildContent(this.schema);
  }

  mutations(name, config) {
    const search = name.replace(this.props.name + '-', '');
    switch (search) {
      case "actionIcon": {
        const cn = [];
        if (this.props.children) cn.push('me-2');
        return {
          ...this.props.iconProps,
          active: !!this.props.icon,
          icon: this.props.icon,
          classes: [cn, this.props.iconClasses].flat().join(' ')
        }
      }
      case 'actionStatus': {
        const classes = [config.classes, this.props.statusClasses[this.props.status]];
        if (this.props.icon || this.props.children) classes.push('ms-2');
        return {
          active: !!this.props.status,
          icon: this.props.statusIcons[this.props.status],
          classes,
        }
      }
      case "actionContent": {
        return {
          active: !!this.props.children,
          content: this.props.children,
        }
      }
      default:
        break;
    }
  }

}
