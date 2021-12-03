import React from "react";
import PropTypes from "prop-types";

import Component from "../component";

export default class Video extends Component {
  static jsClass = 'Video';
  static propTypes = {
    ...Component.propTypes,
    autoplay: PropTypes.bool,
    controls: PropTypes.bool,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    loop: PropTypes.bool,
    muted: PropTypes.bool,
    playsinline: PropTypes.bool,
    poster: PropTypes.string,
    preload: PropTypes.oneOf(['none', 'metadata', 'auto', true]),
    src: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  };
  tag = 'video';

  get componentProps() {
    const {
      autoplay, controls,
      height, loop, muted,
      playsinline, poster,
      preload, src, width
    } = this.props;
    return {
      autoplay, controls,
      height, loop, muted,
      playsinline, poster,
      preload, src, width,
      ...this.props._props
    };
  }

  content(children = this.props.children) {
    if (this.props.src) return false;
    return this.props.sources.map(s =>
      <source src={s.src} type={s.type} />);
  }
}