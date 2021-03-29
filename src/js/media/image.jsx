import React from "react";
import Component from "../component";

export default class Image extends Component {

  static jsClass = 'Image';
  static defaultProps = {
    ...Component.defaultProps,
    objectFit: 'cover',
    style: {
      overflow: 'hidden'
    }
  }

  tag = 'figure';
  classes = 'position-relative';

  content() {
    const { src, alt, children, width, height, objectFit } = this.props;
    const imgSrc = typeof src === 'object' ? src.default : src;
    delete src.default;
    return (<>
      <picture>
        {typeof src === 'object' && Object.keys(src).map(min =>
          <source srcset={src[min]} media={`(min-width: ${min}px)`} />
        )}
        <img src={imgSrc} alt={alt} width={width} height={height} style={{ objectFit }} />
      </picture>
      <figcaption>{children}</figcaption>
    </>);
  }
}
