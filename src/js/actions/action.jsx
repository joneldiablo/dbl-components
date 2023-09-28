import eventHandler from "../functions/event-handler";
import Component from "../component";

export default class ActionComponent extends Component {

  static jsClass = 'ActionComponent';
  static defaultProps = {
    ...Component.defaultProps,
    type: 'button',
    classButton: true
  }

  tag = 'button';

  constructor(props) {
    super(props);
    this.state.localClasses = props.classButton ? 'btn' : '';
    this.eventHandlers.onClick = this.onClick;
  }

  onClick = (e) => {
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
      return history.push(path);
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

  content(children = this.props.children) {
    return children;
  }

}
