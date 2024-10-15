import React from "react";
import PropTypes from 'prop-types';
import Icons from "./icons";

const SvgsImported = {};

export function addSvgs(svgs) {
  Object.assign(SvgsImported, svgs);
}

const SvgImports = (props) => {
  const {
    id,
    name,
    classes,
    className,
    class: _class,
    svg,
    style,
    title,
  } = props;
  const Svg = SvgsImported[svg];
  const cn = [
    Svg ? [
      name,
      [name, 'SvgImports'].join('-'),
    ] : '',
    classes,
    className,
    _class
  ];
  return Svg
    ? <Svg id={id} className={cn.flat().filter(Boolean).join(' ')} style={style} title={title} />
    : <Icons icon="src-error" inline={false} id={id} className={cn} style={style} title={title} />;
}

export default SvgImports;