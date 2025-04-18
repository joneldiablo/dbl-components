import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import { deepMerge } from "dbl-utils";

import Container from "./container";

export default class HeroContainer extends Container {

  static jsClass = 'HeroContainer';

  static defaultProps = {
    ...Container.defaultProps,
    fullWidth: true,
    fluid: false,
    spaceBetween: 0,
    slidesPerView: 1
  }

  onSlideChange = () => {
    //console.log('has chyange!!!')
  }

  onSwiper = (swipe) => {
    //console.log(swipe)
  }

  content(children = this.props.children) {
    if (!this.breakpoint) return this.waitBreakpoint;
    const { spaceBetween, slidesPerView, autoplayDelay, swiperpros } = this.props;
    let propsSwiper = {
      spaceBetween,
      slidesPerView,
      modules: [Autoplay],
      autoplay: {
        delay: autoplayDelay || 6000,
        disableOnInteraction: false,
      },
      onSlideChange: this.onSlideChange,
      onSwiper: this.onSwiper,
    }
    if (children.length < 2) {
      Object.assign(propsSwiper, {
        resistance: true,
        resistanceRatio: 0
      });
    }
    if (typeof swiperpros === 'object') {
      deepMerge(propsSwiper, swiperpros);
    }
    return (React.createElement(Swiper, { ...propsSwiper },
      children.map((slide, i) => {
        if (!slide) return false;

        const props = (!(slide.props.style && slide.props.style['--component-name'])
          ? slide : slide.props.children).props;
        return React.createElement(SwiperSlide,
          {
            key: i, virtualIndex: i,
            style: {
              backgroundImage: `url("${props.image}")`,
              backgroundAttachment: props.imageAttachment
            }
          },
          slide
        )
      }).filter(s => !!s)
    ));
  }

}