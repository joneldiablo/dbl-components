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
    return (<>
      <picture>
        {src !== null && typeof src === 'object' && Object.keys(src).map(min =>
          <source srcset={src[min]} media={`(min-width: ${min}px)`} />
        )}
        <img src={imgSrc} alt={alt} width={width} height={height} style={{ objectFit, objectPosition: 'center' }} className={imageClasses} />
      </picture>
      <figcaption>{children}</figcaption>
    </>);
  }
}
