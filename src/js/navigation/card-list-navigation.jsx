import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../functions";
import Icons from "../media/icons";

export default class NavListCards extends React.Component {
  static defaultProps = {
    menu: []
  }

  state = {
    type: 'list'
  }

  componentDidMount() {

  }

  get asCards() {
    let { menu } = this.props;
    return (<div className="container-fluid p-4">
      <div className="row gx-3">
        {menu.map((item, i) =>
          <div className="col-12 col-sm-auto" key={i}>
            <div className="card" style={{ backgroundImage: `url(${assets('images', item.image)})` }}>
              <div className="card-body">
                <h5 className="card-title nav-item">
                  <Icons icon={item.icon} className="mr-2" />
                  {item.label}
                  <hr className="my-1" />
                </h5>
                <p className="card-subtitle mb-2 text-muted">
                  {item.description}
                </p>
                <Link to={item.path} className="stretched-link"></Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>);
  }

  get asList() {
    let { menu } = this.props;
    return (<ul className="list-group list-group-flush">
      {menu.map((item, i) => <li key={i} className="list-group-item">
        <Link to={item.path} className="list-group-item-action text-decoration-none">
          <Icons icon={item.icon} className="mr-2" />
          {item.label}
          <Icons icon="chevron-right" className="float-right small" />
        </Link>
      </li>)}
    </ul>);
  }

  render() {
    return this.state.type === 'list' ? this.asList : this.asCards;
  }
}