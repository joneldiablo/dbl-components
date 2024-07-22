import React from "react";
import PropTypes from "prop-types";

import Component from "../component";

export default class Image extends Component {

  static jsClass = 'Image';
  static propTypes = {
    ...Component.propTypes,
    src: PropTypes.string,
    alt: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    objectFit: PropTypes.string,
    objectPosition: PropTypes.string,
    imageClasses: PropTypes.oneOfType([PropTypes.arrayOf('string'), PropTypes.string])
  }
  static defaultProps = {
    ...Component.defaultProps,
    objectFit: 'cover',
    objectPosition: 'center',
    imageClasses: '',
    style: {
      overflow: 'hidden'
    }
  }

  tag = 'figure';
  classes = 'position-relative';

  content() {
    const { src, alt, children, width, height, objectFit, objectPosition, imageClasses } = this.props;
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
            style: { objectFit, objectPosition },
            className: [imageClasses].flat().filter(Boolean).join(' ')
          }
        )
      ),
      React.createElement('figcaption', this.props.contentProps, children)
    ));
  }
}
