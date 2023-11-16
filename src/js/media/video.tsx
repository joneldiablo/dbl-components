import React from "react";
import PropTypes from "prop-types";

import Component from "../component";

export default class Video extends Component {
  static jsClass = 'Video';
  static propTypes = {
    ...Component.propTypes,
    autoPlay: PropTypes.bool,
    controls: PropTypes.bool,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    loop: PropTypes.bool,
    muted: PropTypes.bool,
    playsInline: PropTypes.bool,
    poster: PropTypes.string,
    preload: PropTypes.oneOf(['none', 'metadata', 'auto', true]),
    src: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  };
  tag = 'video';

  get componentProps() {
    const {
      autoPlay, controls,
      height, loop, muted,
      playsInline, poster,
      preload, src, width
    } = this.props;
    return {
      autoPlay, controls,
      height, loop, muted,
      playsInline, poster,
      preload, src, width,
      ...this.props._props
    };
  }

  content(children = this.props.children) {
    if (this.props.src) return false;
    return this.props.sources.map((s, i) =>
      <source src={s.src} type={s.type} key={i} />);
  }
}