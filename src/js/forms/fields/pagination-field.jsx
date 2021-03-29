import React from "react";
import PropTypes from "prop-types";
import Field from "./field";

export default class PaginationField extends Field {

  static jsClass = 'PaginationField';
  static propTypes = {
    ...Field.propTypes,
    total: PropTypes.number.isRequired
  }
  static defaultProps = {
    ...Field.defaultProps,
    total: 1,
    default: 1,
    texts: {
      first: 'Primer página',
      previus: 'Página Anterior',
      next: 'Siguiente página',
      last: 'Última página',
      pages: 'Páginas',
      goto: 'Ir a la página...'
    }
  }

  tag = 'nav';

  constructor(props) {
    super(props);
    this.state.total = props.total;
  }

  onUpdate({ total, ...data }) {
    if (total) this.setState({ total });
    super.onUpdate(data);
  }

  get type() {
    return 'number';
  }

  get inputProps() {
    const props = super.inputProps;
    props.className = 'page-link border-end-0 text-end pe-0';
    props.style = {
      ...props.style,
      width: 58,
    }
    props.max = this.state.total;
    props.min = 1;
    return props;
  }

  isFirst() {
    return this.state.value == 1;
  }

  isLast() {
    return this.state.value == this.state.total;
  }

  gotoPage(newPage) {
    let { value } = this.state;
    value = parseInt(value);
    switch (newPage) {
      case 'first':
        value = 1;
        break;
      case 'last':
        value = this.state.total;
        break;
      default:
        value += newPage;
        break;
    }
    this.setState({
      value
    }, () => this.returnData());
  }

  returnData(value = this.state.value) {
    const { total } = this.state;
    if (value > total) {
      value = total;
    } else if (value < 1) {
      value = 1;
    }
    super.returnData(value);
  }

  content() {
    const { paginationClasses, texts } = this.props;
    const { total } = this.state;
    const cn = ['pagination', paginationClasses];
    const isFirst = this.isFirst();
    const isLast = this.isLast();
    return <ul className={cn.join(' ')}>
      <li className={'page-item' + (isFirst ? ' disabled' : '')} title={texts.first}>
        <button type="button" className="page-link" disabled={isFirst}
          onClick={() => this.gotoPage('first')}>
          <span>«</span>
        </button>
      </li>
      <li className={'page-item' + (isFirst ? ' disabled' : '')} title={texts.previus}>
        <button type="button" className="page-link" disabled={isFirst}
          onClick={() => this.gotoPage(-1)}>
          <span>‹</span>
        </button>
      </li>
      <li className="page-item" title={texts.goto}>
        {this.inputNode}
      </li>
      <li className="page-item disabled">
        <span className="page-link border-start-0 border-end-0 px-1">/</span>
      </li>
      <li className="page-item disabled" title={total + ' ' + texts.pages} style={{ width: 58 }}>
        <span className="page-link border-start-0" >{total}</span>
      </li>
      <li className={'page-item' + (isLast ? ' disabled' : '')} title={texts.next}>
        <button type="button" className="page-link" className="page-link" disabled={isLast}
          onClick={() => this.gotoPage(1)}>
          <span>›</span>
        </button>
      </li>
      <li className={'page-item' + (isLast ? ' disabled' : '')} title={texts.last}>
        <button type="button" className="page-link" className="page-link" disabled={isLast}
          onClick={() => this.gotoPage('last')}>
          <span>»</span>
        </button>
      </li>
    </ul>
  }

};