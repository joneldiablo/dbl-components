import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import Container from "./container";

export default class HeroContainer extends Container {

  static defaultProps = {
    ...Container.defaultProps,
    fullWidth: false,
    fluid: false,
    spaceBetween: 0,
    slidesPerView: 1
  }

  onSlideChange = () => {
    console.log('has chyange!!!')
  }

  onSwiper = (swipe) => {
    console.log(swipe)
  }

  content(children = this.props.children) {
    const { content: slideConf, spaceBetween, slidesPerView } = this.props;
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
      {children.map((slide, i) =>
        <SwiperSlide key={i} virtualIndex={i}
          style={{ backgroundImage: `url("${slideConf[i].image}")`, backgroundAttachment: slideConf[i].imageAttachment }} >
          {slide}
        </SwiperSlide>
      )}
    </Swiper>);
  }

}