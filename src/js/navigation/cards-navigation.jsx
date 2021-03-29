import React from "react";
import { Link } from "react-router-dom";
import { randomS4 } from "../functions";
import Icons from "../media/icons";

export default class CardsNavigation extends React.Component {

  static jsClass = 'CardsNavigation';
  static defaultProps = {
    menu: []
  }

  state = {
    rowCols: ' row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5'
  }

  id = randomS4();

  onResize = ({ target, width }) => {
    if (target.id !== this.props.closestId) return;
    let rowCols = '';
    if (width >= 1400)//xxl
      rowCols = ' row-cols-5';
    else if (width >= 1200)//xl
      rowCols = ' row-cols-4';
    else if (width >= 768)//lg
      rowCols = ' row-cols-3';
    //else if (width >= 992)//md
    //  rowCols = ' row-cols-3';
    else if (width >= 576)//sm
      rowCols = ' row-cols-2';
    else//xs
      rowCols = '';
    this.setState({
      rowCols
    });
  }

  componentDidMount() {
    let { closestId } = this.props;
    if (closestId) {
      document.addEventListener('resize', this.onResize);
    }
  }

  render() {
    let { menu } = this.props;
    let rowClassName = 'row g-3 ' + this.state.rowCols;
    return <div className="container-fluid p-4 nav-cards">
      <div className={rowClassName}>
        {menu.map((item, i) =>
          <div className="" key={i}>
            <div className="card h-100 shadow-hover">
              {item.image ? <img src={item.image} className="card-img" style={{
                opacity: .3,
                objectFit: 'cover',
                minHeight: 150
              }} /> : <div className="card-img" style={{ minHeight: 150 }}></div>}
              <div className="card-img-overlay">
                <div className="card-body nav-card-body">
                  <h5 className="card-title nav-item">
                    <Icons icon={item.icon} className="mr-2" />
                    {item.label}
                    <Icons icon="chevron-right" className="small float-right" />
                    <hr className="my-1" />
                  </h5>
                  <p className="card-subtitle mb-2 text-muted">
                    {item.description}
                  </p>
                  <Link to={item.path} className="stretched-link"></Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>;
  }
}