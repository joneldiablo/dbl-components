import React from "react";

import Icons from "./icons";

export type SvgComponent = React.FC<React.SVGProps<SVGSVGElement>>;

const SvgsImported: Record<string, SvgComponent | undefined> = {};

export function addSvgs(svgs: Record<string, SvgComponent>): void {
  Object.assign(SvgsImported, svgs);
}

export interface SvgImportsProps {
  id?: string;
  name?: string;
  classes?: string | string[];
  className?: string | string[];
  class?: string | string[];
  svg: string;
  style?: React.CSSProperties;
  title?: string;
}

const SvgImports: React.FC<SvgImportsProps> = (props) => {
  const {
    id,
    name,
    classes,
    className,
    class: classProp,
    svg,
    style,
    title,
  } = props;

  const Svg = SvgsImported[svg];
  const cn = [
    Svg ? [name, [name, "SvgImports"].join("-")] : "",
    classes,
    className,
    classProp,
  ]
    .flat()
    .filter(Boolean)
    .join(" ");

  return Svg ? (
    <Svg id={id} className={cn} style={style} {...((title ? { title } : {}) as any)} />
  ) : (
    <Icons icon="src-error" inline={false} id={id} className={cn} style={style} title={title} />
  );
};

export default SvgImports;
