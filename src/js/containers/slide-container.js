import React from "react";
import { Splide, SplideSlide } from '@splidejs/react-splide';

import Container from "./container";

export default class SlideContainer extends Container {

  static jsClass = 'SlideContainer';
  static defaultProps = {
    ...Container.defaultProps,
    slider: {
      options: {
        perPage: 1,
        rewind: true
      }
    }
  }

  content(children = this.props.children) {
    const attrs = this.props.slider;
    const mapSlides = ([i, c]) =>
      !!c && React.createElement(SplideSlide, { key: i }, c);

    return !!this.breakpoint
      ? React.createElement(Splide,
        { ...attrs, destroy: 'completely', key: this.name + ';perPage=' + attrs.options.perPage },
        ...Object.entries([children].flat()).map(mapSlides).filter(c => !!c)
      )
      : this.waitBreakpoint;
  }

}