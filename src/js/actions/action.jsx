import eventHandler from "../functions/event-handler";
import Component from "../component";

export default class ActionComponent extends Component {

  static jsClass = 'ActionComponent';
  static defaultProps = {
    ...Component.defaultProps,
    type: 'button'
  }

  tag = 'button';

  constructor(props) {
    super(props);
    this.state.localClasses = 'btn';
    this.eventHandlers.onClick = this.onClick;
  }

  onClick = (e) => {
    e.stopPropagation();
    const { value, name, id } = this.props;
    let dispatch = name;
    if (value || id) {
      dispatch = { [name]: value, id }
    }
    eventHandler.dispatch(name, dispatch);
  }

  get componentProps() {
    const { type, disabled } = this.props;
    const { form, ..._props } = this.props._props || {};
    return { type, disabled, ..._props, form: form ? form + '-form' : undefined };
  }

  content(children = this.props.children) {
    return children;
  }

}
