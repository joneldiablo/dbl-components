import PropTypes from "prop-types";

import { resolveRefs, eventHandler } from "dbl-utils";

import { ptClasses } from "../prop-types";
import JsonRender from "../json-render";
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
    justifyContent: PropTypes.oneOf(['start', 'center', 'end'])
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
    iconProps: {},
    justifyContent: 'center'
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
  classes = 'd-inline-flex align-items-center';


  constructor(props) {
    super(props);
    this.classes += ' justify-content-' + props.justifyContent;
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
    const { navigate, to, search, hash, type, open, close, value, name, id, navOptions = {} } = this.props;

    if (type === 'link' && to) {
      if (typeof to === 'number') navigate(to);
      else {
        navigate({
          ...navOptions,
          pathname: to,
          search,
          hash,
          state: {
            name, id, value
          }
        });
      }
    }

    if (open) {
      eventHandler.dispatch('update.' + open, { open: true });
    }
    if (close) {
      eventHandler.dispatch('update.' + close, { open: false });
    }

    let dispatch = name;
    if (value || id) {
      dispatch = { [name]: value, id };
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
