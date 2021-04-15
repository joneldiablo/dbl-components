import React from "react";
import Modal from "bootstrap/js/dist/modal";

import eventHandler from "../functions/event-handler";
import Component from "../component";

export default class ModalContainer extends Component {

  static jsClass = 'ModalContainer';
  static defaultProps = {
    ...Component.defaultProps,
    modal: {}
  }

  constructor(props) {
    super(props);
    this.events = [
      'show',
      'shown',
      'hide',
      'hidden',
      'hidePrevented'
    ];
    this.state.showModal = !!props.open;
  }

  componentDidMount() {
    const { name } = this.props;
    eventHandler.subscribe('update.' + name, this.onUpdateModal);
  }

  componentWillUnmount() {
    const { name } = this.props;
    this.destroy();
    eventHandler.unsubscribe('update.' + name);
  }

  onEvent = (e) => {
    const { name } = this.props;
    eventHandler.dispatch(name, { [name]: e.type.split('.')[0] });
  }

  onClickClose = (e) => {
    this.modal.hide();
  }

  onUpdateModal = ({ open: showModal }) => {
    if (!showModal) {
      return this.modal.hide();
    }
    this.setState({ showModal });
  }

  destroy = () => {
    if (this.modal) {
      this.modal.dispose();
      this.modal = null;
    }
    this.setState({ showModal: false });
  }

  onModalRef = (ref) => {
    if (ref) {
      this.modal = new Modal(ref, this.props.modal);
      this.events.forEach(event => {
        ref.addEventListener(event + '.bs.modal', this.onEvent, false);
      });
      ref.addEventListener('hidden.bs.modal', this.destroy, false);
      this.modal.show();
    }
  }

  content(children = this.props.children) {
    const { modalClasses, name, showClose, headerClasses,
      bodyClasses, footerClasses } = this.props;
    const { showModal } = this.state;
    const cnModal = ['modal-dialog', modalClasses];
    const cg = children.reduce((reducer, child) => {
      // Se separa el contenido según tipo de container header, body, footer o ninguno
      if (typeof child === 'string') {
        reducer[1].push(child);
        return reducer;
      }
      const childProps = child.props.children.props;
      const container = reducer[childProps.container] || reducer.content;
      container.push(child);
      return reducer;
    }, { header: [], body: [], footer: [], content: [] });
    return (showModal && <div ref={this.onModalRef} className="modal fade" id={name + '-modal'} tabIndex="-1" >
      <div className={cnModal.join(' ')} >
        <div className="modal-content">
          {showClose && <button type='button'
            className='btn-close position-absolute end-0 m-3'
            data-bs-dismiss='modal'></button>}
          {cg.content}
          {!!cg.header.length && <div className={'modal-header ' + headerClasses}>{cg.header}</div>}
          {!!cg.body.length && <div className={'modal-body ' + bodyClasses}>{cg.body}</div>}
          {!!cg.footer.length && <div className={'modal-footer ' + footerClasses}>{cg.footer}</div>}
        </div>
      </div>
    </div>);
  }

}