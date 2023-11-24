import React from "react";
import Modal from "bootstrap/js/dist/modal";

import eventHandler from "../functions/event-handler";
import Component from "../component";

export default class ModalButtonContainer extends Component {

  static jsClass = 'ModalButtonContainer';

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

  onEvent = (e) => {
    const { name } = this.props;
    eventHandler.dispatch(name, { [name]: e.type.split('.')[0] });
  }

  onClickClose = (e) => {
    this.modal.hide();
  }

  onToggleModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ showModal: !this.state.showModal });
  }

  onModalRef = (ref) => {
    if (ref) {
      this.modal = new Modal(ref, {
        backdrop: false
      });
      this.events.forEach(event => {
        ref.addEventListener(event + '.bs.modal', this.onEvent, false);
      });
      ref.addEventListener('hidden.bs.modal', this.onToggleModal, false);
      this.modal.show();
    }
  }

  content(children = this.props.children) {
    const { btnClasses, label, value, modalClasses, disabled, name } = this.props;
    const { showModal } = this.state;
    const cn = ['btn', btnClasses];
    const cnModal = ['modal-dialog', modalClasses];
    // TODO: no crear el modal hasta que se hace click!!!!
    return React.createElement(React.Fragment, {},
      React.createElement('button',
        { className: cn.join(' '), type: "button", disabled, onClick: this.onToggleModal },
        label || value
      ),
      showModal && React.createElement('div',
        {
          ref: this.onModalRef, className: "modal fade",
          id: name + '-modal', tabIndex: "-1"
        },
        React.createElement('div',
          {
            className: "backdrop",
            onClick: this.onClickClose,
            style: {
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100vh',
              background: 'rgb(0 0 0 / 0.5)',
              zIndex: 1040
            }
          }
        ),
        React.createElement('div',
          { className: cnModal.join(' '), style: { zIndex: 1040 } },
          React.createElement('div',
            { className: "modal-content" },
            children.reduce((childs, child) => {
              if (typeof child === 'string') {
                childs[1].push(child);
                return childs;
              }
              const indexParser = {
                'header': 0,
                'body': 1,
                'footer': 2,
                'content': 3
              };
              const container = childs[indexParser[child.props.container] || 3];
              container.push(child);
              return childs;
            }, [[], [], [], []]).map((content, i) => {
              const classParser = [
                'modal-header',
                'modal-body',
                'modal-footer',
                ''
              ];
              if (classParser[i] && content.length) {
                return React.createElement('div',
                  { key: i, className: classParser[i] },
                  content
                );
              } else {
                return content;
              }
            })
          )
        )
      )
    );
  }
}