import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import Icons from "../media/icons";

export default class NavListCards extends React.Component {

  static propTypes = {
    menu: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
  }

  static jsClass = 'NavListCards';
  static defaultProps = {
    menu: []
  }

  constructor(props) {
    super(props);
    this.state = {
      type: 'list'
    };
  }

  componentDidMount() {

  }

  getAsCards() {
    let { menu } = this.props;
    return (
      React.createElement('div', { className: "container-fluid p-4" },
        React.createElement('div', { className: "row gx-3" },
          Object.entries(menu).map(([i, item]) =>
            React.createElement('div', { className: "col-12 col-sm-auto", key: i },
              React.createElement('div', { className: "card", style: { backgroundImage: `url(${item.image})` } },
                React.createElement('div', { className: "card-body" },
                  React.createElement('h5', { className: "card-title nav-item" },
                    React.createElement(Icons, { icon: item.icon, className: "mr-2" }),
                    item.label,
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

  getAsList() {
    let { menu } = this.props;
    return (
      React.createElement('ul', { className: "list-group list-group-flush" },
        Object.entries(menu).map(([i, item]) => React.createElement('li', { key: i, className: "list-group-item" },
          React.createElement(Link, { to: item.path, className: "list-group-item-action text-decoration-none" },
            React.createElement(Icons, { icon: item.icon, className: "mr-2" }),
            item.label,
            React.createElement(Icons, { icon: "chevron-right", className: "float-right small" })
          )
        ))
      )
    );
  }

  render() {
    return this.state.type === 'list' ? this.getAsList() : this.getAsCards();
  }

}
