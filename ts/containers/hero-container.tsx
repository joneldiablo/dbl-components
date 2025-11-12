import React from "react";
import { Swiper, SwiperSlide, type SwiperProps } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";

import { deepMerge } from "dbl-utils";

import Container from "./container";
import type { ContainerProps } from "./container";

export interface HeroContainerProps extends ContainerProps {
  spaceBetween?: number;
  slidesPerView?: number;
  autoplayDelay?: number;
  swiperpros?: Record<string, unknown>;
  children?: React.ReactNode;
}

type SlideContentProps = {
  image?: string;
  imageAttachment?: string;
};

/**
 * Hero slider built on top of Swiper with autoplay support.
 *
 * @example
 * ```tsx
 * <HeroContainer name="hero">
 *   <div image="/img/slide-1.jpg" />
 *   <div image="/img/slide-2.jpg" />
 * </HeroContainer>
 * ```
 */
export default class HeroContainer extends Container {
  declare props: HeroContainerProps;
  static override jsClass = "HeroContainer";
  static override defaultProps: Partial<HeroContainerProps> = {
    ...Container.defaultProps,
    fullWidth: true,
    fluid: false,
    spaceBetween: 0,
    slidesPerView: 1,
  };

  private onSlideChange = (): void => {
    // Intentionally empty; consumers can override through props if needed.
  };

  private onSwiper = (_swiper: SwiperInstance): void => {
    // Placeholder for potential integrations; maintained for backward compatibility.
  };

  override content(children: React.ReactNode = this.props.children): React.ReactNode {
    if (!this.breakpoint) return this.waitBreakpoint;

    const {
      spaceBetween = 0,
      slidesPerView = 1,
      autoplayDelay,
      swiperpros,
    } = this.props;

    const slides = React.Children.toArray(children).filter(React.isValidElement) as React.ReactElement[];

    const swiperConfig: (SwiperProps & Record<string, unknown>) = {
      spaceBetween,
      slidesPerView,
      modules: [Autoplay],
      autoplay: {
        delay: autoplayDelay ?? 6000,
        disableOnInteraction: false,
      },
      onSlideChange: this.onSlideChange,
      onSwiper: this.onSwiper,
    };

    if (slides.length < 2) {
      Object.assign(swiperConfig, {
        resistance: true,
        resistanceRatio: 0,
      });
    }

    if (swiperpros && typeof swiperpros === "object") {
      deepMerge(swiperConfig, swiperpros as Record<string, unknown>);
    }

    const renderedSlides = slides
      .map((slide, index) => {
        const hasComponentName =
          !!slide.props?.style?.["--component-name"];
        const element = hasComponentName && React.isValidElement(slide.props.children)
          ? (slide.props.children as React.ReactElement<SlideContentProps>)
          : slide;
        const props = (React.isValidElement(element) ? element.props : {}) as SlideContentProps;

        const style: React.CSSProperties = {
          backgroundImage: props.image ? `url("${props.image}")` : undefined,
          backgroundAttachment: props.imageAttachment,
        };

        return React.createElement(
          SwiperSlide,
          {
            key: index,
            virtualIndex: index,
            style,
          },
          slide
        );
      })
      .filter(Boolean);

    return React.createElement(
      Swiper,
      swiperConfig,
      renderedSlides
    );
  }
}
