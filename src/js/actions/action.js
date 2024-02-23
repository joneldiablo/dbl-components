import JsonRender from "../json-render";
import resolveRefs from "../functions/resolve-refs";
import eventHandler from "../functions/event-handler";
import Component from "../component";

export default class ActionComponent extends Component {

  static jsClass = 'Action';
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
    iconClasses: ''
  };
  static schemaContent = {
    actionIcon: {
      name: ["$props/name", "actionIcon"],
      component: "Icons",
      icon: "$props/icon",
      classes: ["me-2 float-start", "$props/iconClasses"]
    },
    actionStatus: {
      name: ["$props/name", "actionStatus"],
      component: 'Icons',
      icon: "$state/status",
      classes: ["ms-2 float-end", "$state/statusClasses"]
    },
    actionContent: {
      name: ["$props/name", "actionContent"],
      tag: 'span'
    }
  };

  tag = 'button';

  constructor(props) {
    super(props);
    this.state.localClasses = props.classButton ? 'btn' : '';
    this.onClick = this.onClick.bind(this);
    this.eventHandlers.onClick = this.onClick;
    this.schema = resolveRefs(ActionComponent.schemaContent, { props });
    this.jsonRender = new JsonRender({
      childrenIn: [props.name, 'actionContent'],
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
        return {
          active: !!this.props.icon,
          icon: this.props.icon
        }
      }
      case 'actionStatus': {
        return {
          active: !!this.props.status,
          icon: this.props.statusIcons[this.props.status],
          classes: [config.classes[0], this.props.statusClasses[this.props.status]],
        }
      }
      case "actionContent": {
        return {
          active: !!this.props.children
        }
      }
      default:
        break;
    }
  }

}
