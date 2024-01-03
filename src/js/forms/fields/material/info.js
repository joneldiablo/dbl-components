import PropTypes from 'prop-types';
import React from 'react';
import HelpOutline from '@material-ui/icons/HelpOutline';
import { Popover, Box, Typography } from "@material-ui/core";
export default class HelpInputComponent extends React.Component {

  static propTypes = {
    message: PropTypes.node
  }

  constructor(props) {
    super(props);
    this.state = {
      element: null
    };
  }

  showPopup = (event) => {
    this.setState({ element: event.currentTarget });
  }

  hidePopup = () => {
    this.setState({ element: null })
  }

  render() {
    const open = ((this.state.element != null) && !!this.props.message);

    return (
      React.createElement(React.Fragment, {},
        React.createElement(HelpOutline,
          {
            style: { cursor: 'pointer' },
            color: "secondary",
            'aria-owns': this.state.open ? 'mouse-over-popover' : undefined,
            onClick: this.showPopup,
            'aria-haspopup': "true"
          }),
        React.createElement(Popover,
          {
            id: "mouse-over-popover",
            anchorEl: this.state.element,
            open: open,
            onClose: this.hidePopup,
            disableRestoreFocus: true,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'center',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'center',
            }
          },
          React.createElement(Box, { p: 2 },
            React.createElement(Typography, {}, this.props.message)
          )
        )
      )
    )
  }
}
