import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
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
    const { spaceBetween, slidesPerView } = this.props;
    let propsSwiper = {
      spaceBetween,
      slidesPerView,
      onSlideChange: this.onSlideChange,
      onSwiper: this.onSwiper,

    }
    if (children.length < 2) {
      Object.assign(propsSwiper, {
        resistance: true,
        resistanceRatio: 0
      });
    }
    return (<Swiper {...propsSwiper}>
      {children.map((slide, i) => {
        const props = slide.type === 'section' && slide.props.className.includes('-section') ?
          slide.props.children.props : slide.props;
        return <SwiperSlide key={i} virtualIndex={i}
          style={{
            backgroundImage: `url("${props.image}")`,
            backgroundAttachment: props.imageAttachment
          }} >
          {slide}
        </SwiperSlide>
      })}
    </Swiper>);
  }

}