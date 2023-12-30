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
    return React.createElement(Splide,
      { ...attrs },
      ...children.map((c, i) =>
        !!c && React.createElement(SplideSlide, { key: i }, c)
      ).filter(c => !!c)
    );
  }

}