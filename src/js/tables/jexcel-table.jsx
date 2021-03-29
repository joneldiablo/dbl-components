import React from "react";
import ReactDom from "react-dom";
import jexcel from "jexcel";
import Icons from "../media/icons";

export default class JexcelTable extends React.Component {

  static jsClass = 'JexcelTable';
  static defaultProps = {
    url: '',
    nestedHeaders: null,
    columns: null
  }

  constructor(props) {
    super(props);
    this.tableRef = new React.createRef();
    let { pathname } = props.location;
    this.instance = pathname + this.constructor.jsClass;
  }

  addRow = () => {
    this.jexcel.insertRow();
  }

  updateTable = (tableInstance, cell, col, row, val, id) => {
    if (col === 0) {
      this.rowRenderActions(cell, row, val);
    }
    if (col === 2) {
      if (!val) return;
      let img = (`<img src=${val} style="height: 40px; width: 100%; object-fit: cover" />`);
      cell.innerHTML = img;
    }
  }

  onResize = ({ target, detail: { width, height } }) => {
    if (!this.table) return;
    let [j] = this.table.getElementsByClassName('jexcel_content');
    if (!j) return;
    j.style.width = Math.min(width - 2, this.ref.offsetWidth) + 'px';
    //j.style.maxHeight = height + 'px';
  }

  rowGotoEdit = (e, id) => {
    e.preventDefault();
    this.props.history.push('/catalogo/' + id);
  }

  rowOpenView = (e, id) => {
    e.preventDefault();
    window.open('https://google.com', '_blank');
  }

  rowDelete = (e) => {
    e.preventDefault();
    this.jexcel.deleteRow();
  }

  loadTable() {
    let w = this.table.offsetWidth - 2;
    let opts = {
      url: this.props.url,
      nestedHeaders: this.props.nestedHeaders,
      columns: this.props.columns,
      freezeColumns: 2,
      tableOverflow: true,
      updateTable: this.updateTable,
      tableWidth: w + 'px',
      lazyLoading: true
    };
    this.jexcel = jexcel(this.table, opts);
  }

  componentDidMount() {
    this.table = this.tableRef.current;
    this.loadTable();
    if (!this.props.closestId) return;
    this.rContainer = document.getElementById(this.props.closestId);
    this.rContainer.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    if (this.rContainer)
      this.rContainer.removeEventListener('resize', this.onResize);
  }

  rowRenderActions(cell, row, val) {
    let rowData = this.jexcel.getRowData(row);
    let div = document.createElement('div');
    ReactDom.render(<div>
      {val}
      <div className="my-2">
        <a href="#" onClick={(e) => this.rowOpenView(e, rowData[0])} className="link-info">
          <Icons icon="eye" className="mr-2" />
        </a>
        <a href="#" onClick={(e) => this.rowGotoEdit(e, rowData[0])}>
          <Icons icon="pencil-square-o" className="mr-2" />
        </a>
        <a href="#" onClick={(e) => this.rowDelete(e)} className="link-danger">
          <Icons icon="trash" />
        </a>
      </div>
    </div>, div);
    cell.innerHTML = null;
    cell.appendChild(div);
  }

  render() {
    return (<div ref={(ref) => this.ref = ref}>
      <div ref={this.tableRef}></div>
      <br /><br />
      <input type='button' value='Add new row' onClick={() => this.addRow()}></input>
    </div >);
  }
}
