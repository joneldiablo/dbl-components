import React from "react";

export interface HeroProps {
  children?: React.ReactNode;
}

/**
 * Simple wrapper that stretches its content to full viewport height.
 */
export default class Hero extends React.Component<HeroProps> {
  static jsClass = "Hero";

  override render(): React.ReactNode {
    return (
      <div style={{ height: "100vh" }}>
        {this.props.children}
      </div>
    );
  }
}
