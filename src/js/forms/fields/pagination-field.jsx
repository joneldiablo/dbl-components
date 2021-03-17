import PropTypes from "prop-types";
import Field from "./field";

export default class PaginationField extends Field {

  static propTypes = {
    ...Field.propTypes,
    total: PropTypes.string.isRequired
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

  get type() {
    return 'number';
  }

  get inputProps() {
    const props = super.inputProps;
    props.className = 'page-link border-end-0 text-end pe-0';
    props.style = {
      ...props.style,
      width: 50,
      max: this.props.total,
      min: 1
    }
    return props;
  }

  isFirst() {
    console.log(this.state.value, 1);
    return this.state.value == 1;
  }

  isLast() {
    return this.state.value == this.props.total;
  }

  gotoPage(newPage) {
    let { value } = this.state;
    value = parseInt(value);
    switch (newPage) {
      case 'first':
        value = 1;
        break;
      case 'last':
        value = this.props.total;
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
    const { total } = this.props;
    if (value > total) {
      value = total;
      this.setState({ value });
    } else if (value < 1) {
      value = 1;
      this.setState({ value });
    }
    super.returnData(value);
  }

  content() {
    const { paginationClasses, texts, total } = this.props;
    const { value } = this.state;
    const cn = ['pagination', paginationClasses];
    const isFirst = this.isFirst();
    const isLast = this.isLast();
    return <ul className={cn.join(' ')}>
      <li className={'page-item' + (isFirst ? ' disabled' : '')} title={texts.first}>
        <button className="page-link" disabled={isFirst}
          onClick={() => this.gotoPage('first')}>
          <span>«</span>
        </button>
      </li>
      <li className={'page-item' + (isFirst ? ' disabled' : '')} title={texts.previus}>
        <button className="page-link" disabled={isFirst}
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
      <li className="page-item disabled" title={total + ' ' + texts.pages} style={{ width: 50 }}>
        <span className="page-link border-start-0" >{total}</span>
      </li>
      <li className={'page-item' + (isLast ? ' disabled' : '')} title={texts.next}>
        <button className="page-link" className="page-link" disabled={isLast}
          onClick={() => this.gotoPage(1)}>
          <span>›</span>
        </button>
      </li>
      <li className={'page-item' + (isLast ? ' disabled' : '')} title={texts.last}>
        <button className="page-link" className="page-link" disabled={isLast}
          onClick={() => this.gotoPage('last')}>
          <span>»</span>
        </button>
      </li>
    </ul>
  }

};