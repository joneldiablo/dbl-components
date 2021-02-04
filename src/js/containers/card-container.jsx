import React from "react";
import Container from "./container";

export default class CardContainer extends Container {

  static defaultProps = {
    ...Container.defaultProps,
  }

  localClasses = 'card';

  content(children = this.props.children) {
    const { content } = this.props;
    let header = [];
    let body = [];
    let footer = [];
    children.forEach((child, i) => {
      if (content[i].header) {
        header.push(child);
      } else if(content[i].footer){
        footer.push(child);
      } else {
        body.push(child);
      }
    });
    return <>
      {!!header.length && <div className="card-header">{header}</div>}
      <div className="card-body">
        {body}
      </div>
      {!!footer.length && <div className="card-footer">{footer}</div>}
    </>;
  }

}