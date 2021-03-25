import React from "react";
import View from "./view";

export default class TitleView extends View {

  content(children = this.props.children) {
    const { label, labelClasses } = this.props;
    return (<>
      <h1 className={labelClasses}>{label}</h1>
      {super.content(children)}
    </>);
  }

}