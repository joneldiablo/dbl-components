import PropTypes from 'prop-types';
import React from "react";
import { Link } from "react-router-dom";

import { randomS4 } from "../functions";
import Icons from "../media/icons";

export default class CardsNavigation extends React.Component {

  static propTypes = {
    closestId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    menu: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
  }

  static jsClass = 'CardsNavigation';
  static defaultProps = {
    menu: []
  }

  constructor(props) {
    super(props);
    this.state = {
      rowCols: ' row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5'
    };
    this.id = randomS4();
  }

  onResize = ({ target, width }) => {
    if (target.id !== this.props.closestId) return;
    let rowCols = '';
    if (width >= 1400)//xxl
      rowCols = ' row-cols-5';
    else if (width >= 1200)//xl
      rowCols = ' row-cols-4';
    else if (width >= 768)//lg
      rowCols = ' row-cols-3';
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
    return React.createElement('div', { className: "container-fluid p-4 nav-cards" },
      React.createElement('div', { className: rowClassName },
        Object.entries(menu).map(([i, item]) =>
          React.createElement('div', { className: "", key: i },
            React.createElement('div', { className: "card h-100 shadow-hover" },
              item.image ? React.createElement('img', {
                src: item.image, className: "card-img", style: {
                  opacity: .3,
                  objectFit: 'cover',
                  minHeight: 150
                }
              }) : React.createElement('div', { className: "card-img", style: { minHeight: 150 } }),
              React.createElement('div', { className: "card-img-overlay" },
                React.createElement('div', { className: "card-body nav-card-body" },
                  React.createElement('h5', { className: "card-title nav-item" },
                    React.createElement(Icons, { icon: item.icon, className: "mr-2" }),
                    item.label,
                    React.createElement(Icons, { icon: "chevron-right", className: "small float-right" }),
                    React.createElement('hr', { className: "my-1" })
                  ),
                  React.createElement('p', { className: "card-subtitle mb-2 text-muted" },
                    item.description
                  ),
                  React.createElement(Link, { to: item.path, className: "stretched-link" })
                )
              )
            )
          )
        )
      )
    );
  }
}
