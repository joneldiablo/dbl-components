import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';

import { ptClasses } from "../prop-types";
import Container from "./container";

/**
 * Custom horizontal scroll component with a custom scrollbar.
 * @param {Object} props - Component properties.
 * @param {string} props.breakpoint - The breakpoint value for responsive design.
 * @param {string} props.orientation - The orientation of the scroll (horizontal/vertical).
 * @param {number} props.width - The width of the scroll container.
 * @param {number} props.height - The height of the scroll container.
 * @param {Array<string>} props.scrollTrackClasses - Array of CSS classes for the scroll track.
 * @param {Array<string>} props.scrollBarClasses - Array of CSS classes for the scroll bar.
 * @param {Object} props.scrollTrackStyle - Inline styles for the scroll track.
 * @param {Object} props.scrollBarStyle - Inline styles for the scroll bar.
 * @param {React.ReactNode} props.children - Child elements to be rendered inside the scroll container.
 * @returns {React.Component} - The ScrollX component with a custom scrollbar.
 */
function ScrollXNode({
  name,
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

  const scrollBarPosition = (percentagePosition) => {
    if (!(scrollTrackRef.current && scrollBarRef.current)) return;
    const scrollBarrPercentage = percentagePosition
      * (scrollTrackRef.current.clientWidth - scrollBarRef.current.clientWidth);
    setScrollBarLeft(scrollBarrPercentage / scrollTrackRef.current.clientWidth);
  }

  const containerPosition = (step) => {
    const newTranslate = Math.min(Math.max(initialTranslate.current + step, -diffContentWidth), 0);
    initialTranslate.current = newTranslate;
    setTranslate(newTranslate);
    scrollBarPosition(Math.abs(newTranslate / diffContentWidth));
  }

  /**
   * Handles the scroll event on the container.
   */
  const handleScroll = () => {
    if (!scrollTrackRef.current) return;
    const container = containerRef.current;
    const scrollLeft = container.scrollLeft;
    const scrollBarPosition = (scrollLeft / diffContentWidth) * (scrollTrackRef.current.clientWidth - scrollBarRef.current.clientWidth);
    setScrollBarLeft(scrollBarPosition / scrollTrackRef.current.clientWidth);
  };

  /**
   * Handles the wheel event for scrolling.
   * @param {Event} event - The wheel event.
   */
  const handleWheel = (event) => {
    let speed = event.deltaX;
    if (speed === 0 && event.shiftKey) {
      event.preventDefault();
      speed = event.deltaY / Math.abs(event.deltaY);
    }
    speed *= 10;

    const container = containerRef.current;
    if (!container) return;

    const containerRatio = -container.scrollWidth / container.clientWidth;
    containerPosition(speed * containerRatio);
  };

  /**
   * Handles the start of a drag event.
   * @param {Event} e - The drag event.
   */
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

  /**
   * Handles the scrollBar drag event.
   * @param {Event} e - The drag event.
   */
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const posValue = e.clientX || (e.touches ? e.touches[0].clientX : 0);
    const initialValue = initialMouseX.current;
    if (!containerRef.current || posValue === 0) return;

    const barPercent = (scrollBarRef.current.clientWidth / scrollTrackRef.current.clientWidth);
    const deltaX = (posValue - initialValue) * barPercent;
    containerPosition(-deltaX);

  };

  /**
   * Handles the end of a drag event.
   * @param {Event} e - The drag event.
   */
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

  /**
   * Handles the touch start event for touch devices.
   * @param {Event} e - The touch event.
   */
  const handleTouchStart = (e) => {
    initialTouchX.current = e.touches[0].clientX;
    setIsTouching(true);
  };

  /**
   * Handles the touch move event for touch devices.
   * @param {Event} e - The touch event.
  */
  const handleTouchMove = (event) => {
    const vector = event.touches[0].clientX - initialTouchX.current;
    initialTouchX.current = event.touches[0].clientX;
    containerPosition(vector);
  };

  /**
   * Handles the touch end event for touch devices.
   * @param {Event} e - The touch event.
   */
  const handleTouchEnd = (e) => {
    setIsTouching(false);
  };

  const containerRef = useRef(null); // Reference to the scroll container.
  const scrollTrackRef = useRef(null); // Reference to the scroll track.
  const scrollBarRef = useRef(null); // Reference to the scroll bar.
  const initialMouseX = useRef(null); // Initial mouse X position for drag events.
  const initialScrollLeft = useRef(null); // Left position of the scroll bar.
  const initialTouchX = useRef(null); // Initial touch X position for touch events.
  const initialTranslate = useRef(0); // Initial transform.

  // State variables.
  const [isTouchDevice, setIsTouchDevice] = useState(false); // Flag for touch device detection.
  const [isTouching, setIsTouching] = useState(false); // Flag for touch device detection.
  const [scrollBarLeft, setScrollBarLeft] = useState(0); // Left position of the scroll bar.
  const [wScrollBar, setWScrollBar] = useState(0); // Width of the scroll bar.
  const [showBar, setShowBar] = useState(false); // Flag to show or hide the scroll bar.
  const [contentWidth, setContentWidth] = useState(0); // Width of the scrollable content.
  const [diffContentWidth, setDiffContentWidth] = useState(0); // difference Width of the scrollable content.
  const [translate, setTranslate] = useState(initialTranslate.current); // Transform value for the scroll bar.

  // Effect to detect if the device supports touch events.
  useLayoutEffect(() => {
    setIsTouchDevice('ontouchstart' in window);
    setScrollBarLeft(0);
    setTranslate(0);
  }, []);

  // Effect to update container and scroll bar properties.
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const contentWidth = container.scrollWidth;
      const containerWidth = container.clientWidth;
      const diffContentWidth = container.scrollWidth - container.clientWidth;

      const isContentOverflowing = contentWidth > containerWidth;
      setShowBar(isContentOverflowing);
      setContentWidth(contentWidth);
      setDiffContentWidth(diffContentWidth);

      const wp = (containerWidth / contentWidth) * 100;
      setWScrollBar(Math.max(Math.min(wp, 90), 20)); // Ensure scrollbar is not too small
    }
  }, [contentWidth, breakpoint, orientation, width, height, isTouchDevice, isTouching]);

  // useEffect to add/remove event listeners
  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);
    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    }
  }, [contentWidth]);

  // Effect to handle scroll events.
  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [wScrollBar, contentWidth]);

  const stc = [scrollTrackClasses]; // Scroll track classes.
  const sbc = ['cursor-pointer', scrollBarClasses]; // Scroll bar classes.
  const fc = (input) => [input].flat().filter(Boolean).join(' '); // Function to flatten and filter class names.

  const styleSbc = {
    height: '100%',
    backgroundColor: '#888',
    ...scrollBarStyle,
    width: `${wScrollBar}%`,
    marginLeft: `${scrollBarLeft * 100}%`
  };

  return (
    <>
      <div
        style={{
          overflowX: 'clip'
        }}
      >
        <div
          ref={containerRef}
          id={`${name}-container`}
          style={{
            paddingBottom: "2rem",
            marginBottom: "-2rem",
            transform: `translate(${translate}px)`
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
            style={styleSbc}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            role="scrollbar"
            aria-controls={`${name}-container`}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={(translate / diffContentWidth) * 100}
            tabIndex="0"
          />
        </div>
      )}
    </>
  );
}

ScrollXNode.propTypes = {
  name: PropTypes.string,
  breakpoint: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  orientation: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  width: PropTypes.number,
  height: PropTypes.number,
  scrollTrackClasses: ptClasses,
  scrollBarClasses: ptClasses,
  scrollTrackStyle: PropTypes.object,
  scrollBarStyle: PropTypes.object,
  children: PropTypes.node
}

/**
 * Container class for the ScrollX component.
 */
export default class ScrollX extends Container {

  static jsClass = 'ScrollX';

  /**
   * Renders the ScrollXNode component with the provided properties.
   * @param {React.ReactNode} children - Child elements to be rendered inside the scroll container.
   * @returns {React.ReactElement} - The rendered ScrollXNode component.
   */
  content(children = this.props.children) {
    const {
      scrollTrackClasses,
      scrollBarClasses,
      scrollTrackStyle,
      scrollBarStyle,
    } = this.props;
    return <ScrollXNode
      {...{
        name: this.props.name,
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
