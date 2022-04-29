import React from "react";
import Field from "./field";

export default class GroupField extends Field {

  static jsClass = 'GroupField';
  static propTypes = {
    ...Field.propTypes
  }

  static defaultProps = {
    ...Field.defaultProps
  }

  get inputNode() {
    const { children, groupClasses } = this.props;
    const start = [], end = [];

    children.forEach(ch => {
      const c = ch.type === 'section' ? ch.props.children : ch;
      if (c.props.position === 'start')
        start.push(<div className="input-group-text" key={c.props.name}>{c}</div>);
      else
        end.push(<div className="input-group-text" key={c.props.name}>{c}</div>);
    });
    const cn = ['input-group', groupClasses];
    const inputNode = (<div className={cn.join(' ')}>
      {start}
      <input {...this.inputProps} />
      {end}
    </div>);
    return inputNode;
  }

  content() {
    return super.content(false);
  }

};