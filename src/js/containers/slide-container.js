import React from "react";
import { Splide, SplideSlide } from '@splidejs/react-splide';

import Component from "../component";

export default class SlideContainer extends Component {

  static jsClass = 'SlideContainer';
  static defaultProps = {
    ...Component.defaultProps,
    slider: {
      options: {
        rewind: true
      }
    }
  }

  content(children = this.props.children) {
    const attrs = this.props.slider;
    const mapSlides = ([i, c]) =>
      !!c && React.createElement(SplideSlide, { key: i }, c);

    return React.createElement(Splide,
      { ...attrs, destroy: 'completely' },
      ...Object.entries([children].flat()).map(mapSlides).filter(c => !!c)
    );
  }

}