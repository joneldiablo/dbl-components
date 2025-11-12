import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";

import Container from "./container";
import type { ContainerProps } from "./container";

type SplideConfig = Record<string, unknown> & {
  options?: Record<string, any>;
};

export interface SlideContainerProps extends ContainerProps {
  slider?: SplideConfig;
}

/**
 * Wrapper around Splide slider that adapts behaviour to the container breakpoint.
 */
export default class SlideContainer extends Container {
  declare props: SlideContainerProps;

  static override jsClass = "SlideContainer";
  static override defaultProps: Partial<SlideContainerProps> = {
    ...Container.defaultProps,
    fullWidth: true,
    slider: {
      options: {
        perPage: 1,
        rewind: true,
      },
    },
  };

  override content(children: React.ReactNode = this.props.children): React.ReactNode {
    if (!this.breakpoint) return this.waitBreakpoint;

    const sliderConfig: SplideConfig = {
      destroy: "completely",
      ...this.props.slider,
      options: {
        ...(this.props.slider?.options || {}),
      },
    };

    const slides = React.Children.toArray(children).filter(Boolean);
    const perPage = sliderConfig.options?.perPage ?? 1;

    if (slides.length <= perPage) {
      Object.assign(sliderConfig.options ?? (sliderConfig.options = {}), {
        arrows: false,
        pagination: false,
        drag: false,
      });
    }

    return React.createElement(
      Splide,
      {
        ...sliderConfig,
        key: `${this.name};perPage=${perPage}`,
      },
      slides.map((content, index) =>
        React.createElement(
          SplideSlide,
          { key: index },
          content
        )
      )
    );
  }
}
