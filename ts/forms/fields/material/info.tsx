import React from "react";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { Popover, Box, Typography } from "@material-ui/core";

export interface InfoProps {
  message?: React.ReactNode;
}

interface InfoState {
  anchorEl: HTMLElement | null;
}

/**
 * Helper icon that displays additional information inside a Material UI popover.
 */
export default class Info extends React.Component<InfoProps, InfoState> {
  state: InfoState = {
    anchorEl: null,
  };

  private showPopup = (event: React.MouseEvent<SVGSVGElement>): void => {
    this.setState({ anchorEl: event.currentTarget });
  };

  private hidePopup = (): void => {
    this.setState({ anchorEl: null });
  };

  render(): React.ReactNode {
    const { message } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl) && !!message;

    return (
      <>
        <HelpOutlineIcon
          style={{ cursor: "pointer" }}
          color="secondary"
          aria-owns={open ? "mouse-over-popover" : undefined}
          aria-haspopup="true"
          onClick={this.showPopup}
        />
        <Popover
          id="mouse-over-popover"
          anchorEl={anchorEl}
          open={open}
          onClose={this.hidePopup}
          disableRestoreFocus
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Box p={2}>
            <Typography>{message}</Typography>
          </Box>
        </Popover>
      </>
    );
  }
}
