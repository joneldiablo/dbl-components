import React from "react";

import Component, { ComponentProps } from "../component";

export interface VideoSource {
  src: string;
  type?: string;
}

export interface VideoProps extends ComponentProps {
  autoPlay?: boolean;
  controls?: boolean;
  height?: number | string;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  poster?: string;
  preload?: "none" | "metadata" | "auto" | true;
  src?: string;
  width?: number | string;
  sources?: VideoSource | VideoSource[];
}

export default class Video extends Component<VideoProps> {
  static jsClass = "Video";

  tag: React.ElementType = "video";

  get componentProps(): Record<string, unknown> {
    const {
      autoPlay,
      controls,
      height,
      loop,
      muted,
      playsInline,
      poster,
      preload,
      src,
      width,
      _props,
    } = this.props;
    return {
      autoPlay,
      controls,
      height,
      loop,
      muted,
      playsInline,
      poster,
      preload,
      src,
      width,
      ..._props,
    };
  }

  content(children: React.ReactNode = this.props.children): React.ReactNode {
    if (this.props.src) return false;
    const sources = this.props.sources;
    const list = Array.isArray(sources) ? sources : [sources];
    return list.map(
      (s, i) =>
        s && <source src={s.src} type={s.type} key={i} />
    );
  }
}

