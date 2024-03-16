import React, { useState, useEffect, useRef } from 'react';

import Container from "./container";

/**
 * Custom horizontal scroll component with a custom scrollbar.
 * @param {Object} props - Component properties.
 * @returns {React.Component} - The ScrollX component with a custom scrollbar.
 */
function ScrollXNode({
  scrollTrackClasses = [], // Scroll track classes.
  scrollBarClasses = [], // Scroll bar classes.
  scrollTrackStyle = {}, // Inline styles for the scroll track.
  scrollBarStyle = {}, // Inline styles for the scroll bar.
  breakpoint,
  orientation,
  width,
  height,
  children, // Child elements of the component.
}) {
  const containerRef = useRef(null); // Reference to the scroll container.
  const scrollTrackRef = useRef(null); // Reference to the scroll track.
  const scrollBarRef = useRef(null); // Reference to the scroll bar.
  const initialMouseX = useRef(null); // Initial mouse X position for drag events.
  const initialScrollLeft = useRef(null); // Left position of the scroll bar.
  // State variables.
  const [isTouchDevice, setIsTouchDevice] = useState(false); // Flag for touch device detection.
  const [scrollBarLeft, setScrollBarLeft] = useState(0); // Left position of the scroll bar.
  const [transform, setTransform] = useState(0); // Left position of the scroll bar.
  const [wScrollBar, setWScrollBar] = useState(0); // Width of the scroll bar.
  const [showBar, setShowBar] = useState(false); // State to dynamically set content style
  const [contentWidth, setContentWidth] = useState(0); // State to dynamically set content style

  // Effect to detect if the device supports touch events.
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window);
  }, []);

  // Effect to update container and scroll bar properties.
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const contentWidth = container.scrollWidth;
      const containerWidth = container.clientWidth;

      const isContentOverflowing = contentWidth > containerWidth;
      setShowBar(isContentOverflowing);
      setContentWidth(contentWidth);

      const wp = (containerWidth / contentWidth) * 100;
      setWScrollBar(Math.max(Math.min(wp, 90), 20)); // Ensure scrollbar is not too small
      setTransform(0);
      setScrollBarLeft(0);
    }

  }, [contentWidth, breakpoint, orientation, width, height]);

  // useEffect to add/remove the wheel event listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [wScrollBar]);

  const handleScroll = () => {
    if (!scrollTrackRef.current) return;
    const container = containerRef.current;
    const contentWidth = container.scrollWidth - container.clientWidth;
    const scrollLeft = container.scrollLeft;
    const scrollBarPosition = (scrollLeft / contentWidth) * (scrollTrackRef.current.clientWidth - scrollBarRef.current.clientWidth);
    setScrollBarLeft(scrollBarPosition / scrollTrackRef.current.clientWidth);
  };

  const handleWheel = (event) => {
    let speed = event.deltaX;
    if (speed === 0 && event.shiftKey) {
      event.preventDefault();
      speed = .03 * event.deltaY / Math.abs(event.deltaY);
    }

    const container = containerRef.current;
    const scrollBar = scrollBarRef.current;
    if (!(container && scrollBar)) return;
    const containerRatio = container.scrollWidth / container.clientWidth;
    const percentScrollLeft = Number(scrollBar.style.marginLeft.replace('%', '')) / 100;
    const barPercent = (scrollBar.clientWidth / scrollTrackRef.current.clientWidth);
    const newScrollLeft = (percentScrollLeft + (speed * containerRatio));
    const max = 1 - barPercent;
    const boundedNewScrollLeft = Math.max(0, Math.min(max, newScrollLeft));
    setScrollBarLeft(boundedNewScrollLeft);

    const translate = -((containerRatio - 1) * container.clientWidth) * (boundedNewScrollLeft / max);
    setTransform(translate);

  };

  const handleDragStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const initialPosValue = e.clientX || (e.touches ? e.touches[0].clientX : 0);
    containerRef.current.removeEventListener('scroll', handleScroll);

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('touchmove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);
    initialMouseX.current = initialPosValue;
    initialScrollLeft.current = scrollBarLeft;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const posValue = e.clientX || (e.touches ? e.touches[0].clientX : 0);
    const initialValue = initialMouseX.current;
    if (!containerRef.current || posValue === 0) return;

    const barPercent = (scrollBarRef.current.clientWidth / scrollTrackRef.current.clientWidth);
    const deltaX = (posValue - initialValue) * barPercent;
    const pxScrollLeft = initialScrollLeft.current * scrollBarRef.current.clientWidth;
    const newScrollLeft = (pxScrollLeft + deltaX) / scrollBarRef.current.clientWidth;
    const max = 1 - barPercent;
    const boundedNewScrollLeft = Math.max(0, Math.min(max, newScrollLeft));
    setScrollBarLeft(boundedNewScrollLeft);

    const container = containerRef.current;
    const containerRatio = container.scrollWidth / container.clientWidth;
    const translate = -((containerRatio - 1) * container.clientWidth) * (boundedNewScrollLeft / max);
    setTransform(translate);

  };

  const handleDragEnd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    containerRef.current.addEventListener('scroll', handleScroll);
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('touchmove', handleDrag);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchend', handleDragEnd);
    initialMouseX.current = 0;
    initialScrollLeft.current = 0;
  };

  const stc = [scrollTrackClasses]; // Scroll track classes.
  const sbc = ['cursor-pointer', scrollBarClasses]; // Scroll bar classes.
  const fc = (input) => [input].flat().filter(Boolean).join(' '); // Function to flatten and filter class names.

  return (
    <>
      <div
        style={{
          overflowX: 'clip'
        }}
      >
        <div
          ref={containerRef}
          style={{
            paddingBottom: "2rem",
            marginBottom: "-2rem",
            transform: `translate(${transform}px)`
          }}
        >
          {children}
        </div>
      </div>
      {showBar && (
        <div
          className={fc(stc)}
          ref={scrollTrackRef}
          style={{
            bottom: 0,
            left: 0,
            right: 0,
            height: '20px',
            backgroundColor: '#ccc',
            ...scrollTrackStyle,
            position: 'sticky',
          }}
        >
          <div
            ref={scrollBarRef}
            className={fc(sbc)}
            style={{
              height: '100%',
              backgroundColor: '#888',
              ...scrollBarStyle,
              width: `${wScrollBar}%`,
              marginLeft: `${scrollBarLeft * 100}%`
            }}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          />
        </div>
      )}
    </>
  );
}

export default class ScrollContainer extends Container {

  static jsClass = 'ScrollContainer';

  content(children = this.props.children) {
    const {
      scrollTrackClasses,
      scrollBarClasses,
      scrollTrackStyle,
      scrollBarStyle,
    } = this.props;
    return <ScrollXNode
      {...{
        breakpoint: this.breakpoint,
        orientation: this.orientation,
        width: this.width,
        height: this.height,
        scrollTrackClasses,
        scrollBarClasses,
        scrollTrackStyle,
        scrollBarStyle,
        children
      }}
    />
  }

}