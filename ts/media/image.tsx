import React from "react";

import Component, { ComponentProps } from "../component";

export interface ImageProps extends ComponentProps {
  src?: string | Record<string, string>;
  alt?: string;
  width?: number | string;
  height?: number | string;
  objectFit?: React.CSSProperties["objectFit"];
  objectPosition?: React.CSSProperties["objectPosition"];
  imageClasses?: string | string[];
  contentProps?: Record<string, unknown>;
}

export default class Image extends Component<ImageProps> {
  static jsClass = "Image";
  static defaultProps: Partial<ImageProps> = {
    ...Component.defaultProps,
    objectFit: "cover",
    objectPosition: "center",
    imageClasses: "",
    style: {
      overflow: "hidden",
    },
  };

  tag: React.ElementType = "figure";
  classes = "position-relative";

  content(children: React.ReactNode = this.props.children): React.ReactNode {
    const {
      src,
      alt,
      width,
      height,
      objectFit,
      objectPosition,
      imageClasses,
      contentProps,
    } = this.props;
    let imgSrc: string = "";
    if (typeof src === "string") {
      imgSrc = src;
    } else if (src && typeof src === "object") {
      imgSrc = src.default as string;
    }

    const className = Array.isArray(imageClasses)
      ? imageClasses.filter(Boolean).join(" ")
      : imageClasses || "";

    return (
      <>
        <picture>
          {src && typeof src === "object" &&
            Object.keys(src).map((min) => (
              <source key={min} srcSet={src[min]} media={`(min-width: ${min}px)`} />
            ))}
          <img
            src={imgSrc}
            alt={alt}
            width={width}
            height={height}
            style={{ objectFit, objectPosition }}
            className={className}
          />
        </picture>
        <figcaption {...contentProps}>{children}</figcaption>
      </>
    );
  }
}

