import React from "react";
import Component from "../component";

export default class Image extends Component {

  static jsClass = 'Image';
  static defaultProps = {
    ...Component.defaultProps,
    objectFit: 'cover',
    imageClasses: '',
    style: {
      overflow: 'hidden'
    }
  }

  tag = 'figure';
  classes = 'position-relative';

  content() {
    const { src, alt, children, width, height, objectFit, imageClasses } = this.props;
    let imgSrc = src;
    if (!imgSrc) {
      imgSrc = '';
    } else if (typeof imgSrc === 'object') {
      imgSrc = src.default;
      delete src.default;
    }
    return (React.createElement(React.Fragment, {},
      React.createElement('picture', {},
        src !== null && typeof src === 'object' &&
        Object.keys(src).map(min =>
          React.createElement('source', { srcset: src[min], media: `(min-width: ${min}px)` })
        ),
        React.createElement('img',
          {
            src: imgSrc, alt, width, height,
            style: { objectFit, objectPosition: 'center' },
            className: imageClasses
          }
        )
      ),
      React.createElement('figcaption', {}, children)
    ));
  }
}
