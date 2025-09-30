import React from "react";

import DropdownButtonContainer, {
  type DropdownButtonContainerProps,
} from "./dropdown-button-container";

export interface DropdownContainerProps extends DropdownButtonContainerProps {}

export default class DropdownContainer extends DropdownButtonContainer {
  static override jsClass = "DropdownContainer";

  constructor(props: DropdownContainerProps) {
    super(props);
    this.trigger = `${props.name}Span`;
  }

  override content(children: React.ReactNode = this.props.children): React.ReactNode {
    const { btnClasses, label, value, disabled, dropdownClass } = this.props;
    const cn = [btnClasses];
    if (dropdownClass !== false) cn.unshift("dropdown-toggle");
    return (
      <>
        {(label || value) && (
          <span
            className={cn.flat().filter(Boolean).join(" ")}
            data-bs-toggle="dropdown"
            aria-expanded={this.state.open}
            onClick={this.onToggleDrop}
            ref={this.refBtn}
            id={this.trigger}
            role="button"
            style={{ cursor: disabled ? "not-allowed" : "pointer", pointerEvents: disabled ? "none" : "auto" }}
            aria-disabled={disabled}
          >
            {label ?? value}
          </span>
        )}
        {this.dropdownRender(children)}
      </>
    );
  }
}
