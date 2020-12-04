import React from 'react';
import HelpOutline from '@material-ui/icons/HelpOutline';
import { Popover, Box, Typography } from "@material-ui/core";
export default class HelpInputComponent extends React.Component {

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
      <>
        <HelpOutline
          style={{ cursor: 'pointer' }}
          color="secondary"
          aria-owns={this.state.open ? 'mouse-over-popover' : undefined}
          onClick={this.showPopup}
          aria-haspopup="true" />
        <Popover

          id="mouse-over-popover"
          anchorEl={this.state.element}
          open={open}
          onClose={this.hidePopup}
          disableRestoreFocus
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Box p={2}>
            <Typography>{this.props.message}</Typography>
          </Box>
        </Popover>
      </>
    )
  }
}
