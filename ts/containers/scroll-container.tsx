import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { eventHandler } from "dbl-utils";

import useEventHandler from "../hooks/use-event-handler";
import Container from "./container";
import type { ContainerProps } from "./container";

type Classes = string | string[];

const normalizeClasses = (value?: Classes): string[] =>
  value === undefined
    ? []
    : Array.isArray(value)
    ? value.flat().map(String)
    : [value];

const combineClasses = (...values: Array<Classes | undefined>): string =>
  values
    .flatMap((value) => normalizeClasses(value))
    .filter(Boolean)
    .join(" ");

interface ScrollXNodeProps {
  name: string;
  scrollTrackClasses?: Classes;
  scrollBarClasses?: Classes;
  scrollTrackStyle?: React.CSSProperties;
  scrollBarStyle?: React.CSSProperties;
  breakpoint?: string | boolean;
  orientation?: string | boolean;
  width?: number;
  height?: number;
  children?: React.ReactNode;
}

const ScrollXNode = ({
  name,
  scrollTrackClasses,
  scrollBarClasses,
  scrollTrackStyle = {},
  scrollBarStyle = {},
  breakpoint,
  orientation,
  width,
  height,
  children,
}: ScrollXNodeProps): React.ReactElement => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollTrackRef = useRef<HTMLDivElement | null>(null);
  const scrollBarRef = useRef<HTMLDivElement | null>(null);
  const initialMouseX = useRef<number>(0);
  const initialScrollLeft = useRef<number>(0);
  const initialTouchX = useRef<number>(0);
  const initialTranslate = useRef<number>(0);
  const changeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [scrollBarLeft, setScrollBarLeft] = useState(0);
  const [scrollBarWidth, setScrollBarWidth] = useState(0);
  const [showBar, setShowBar] = useState(false);
  const [contentWidth, setContentWidth] = useState(0);
  const [diffContentWidth, setDiffContentWidth] = useState(0);
  const [translate, setTranslate] = useState(initialTranslate.current);
  const [percentage, setPercentage] = useState(initialTranslate.current);

  const scrollBarPosition = useCallback(
    (percentagePosition: number) => {
      if (!(scrollTrackRef.current && scrollBarRef.current)) return;
      const trackWidth = scrollTrackRef.current.clientWidth;
      const scrollWidth = scrollBarRef.current.clientWidth;
      const scrollBarOffset =
        percentagePosition * (trackWidth - scrollWidth);
      setScrollBarLeft(scrollBarOffset / trackWidth);
    },
    []
  );

  const containerPosition = useCallback(
    (step: number) => {
      if (!containerRef.current) return;
      if (!diffContentWidth) return;
      const newTranslate = Math.min(
        Math.max(initialTranslate.current + step, -diffContentWidth),
        0
      );
      initialTranslate.current = newTranslate;
      const newPercentage =
        diffContentWidth === 0 ? 0 : Math.abs(newTranslate / diffContentWidth);
      setPercentage(newPercentage);
      setTranslate(newTranslate);
      scrollBarPosition(newPercentage);
      if (changeTimeout.current) clearTimeout(changeTimeout.current);
      changeTimeout.current = setTimeout(() => {
        eventHandler.dispatch(name, {
          [name]: {
            position: Math.abs(newTranslate),
            percentage: newPercentage,
            size: diffContentWidth,
          },
        });
      }, 660);
    },
    [diffContentWidth, name, scrollBarPosition]
  );

  const updateScroll = useCallback(
    (update: { position?: number; percentage?: number; resize?: boolean }) => {
      if (update.position !== undefined) {
        initialTranslate.current = 0;
        containerPosition(update.position);
      }
      if (update.percentage !== undefined) {
        initialTranslate.current = 0;
        const position = -update.percentage * diffContentWidth;
        containerPosition(position);
      }
      if (update.resize && containerRef.current) {
        const container = containerRef.current;
        const newContentWidth = container.scrollWidth;
        const newDiffContentWidth = container.scrollWidth - container.clientWidth;

        setContentWidth(newContentWidth);
        setDiffContentWidth(newDiffContentWidth);

        initialTranslate.current = 0;
        const position = -percentage * newDiffContentWidth;
        containerPosition(position);
      }
    },
    [containerPosition, diffContentWidth, percentage]
  );

  const handleScroll = useCallback(() => {
    if (!scrollTrackRef.current || !scrollBarRef.current || !containerRef.current || !diffContentWidth) {
      return;
    }
    const container = containerRef.current;
    const scrollLeft = container.scrollLeft;
    const trackWidth = scrollTrackRef.current.clientWidth;
    const barWidth = scrollBarRef.current.clientWidth;
    const scrollBarOffset = (scrollLeft / diffContentWidth) * (trackWidth - barWidth);
    setScrollBarLeft(scrollBarOffset / trackWidth);
  }, [diffContentWidth]);

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      let speed = event.deltaX;
      if (speed === 0 && event.shiftKey) {
        event.preventDefault();
        speed = -event.deltaY / Math.abs(event.deltaY || 1);
      }
      speed *= 10;

      const container = containerRef.current;
      if (!container) return;
      const containerRatio = container.scrollWidth / container.clientWidth;
      containerPosition(speed * containerRatio);
    },
    [containerPosition]
  );

  const handleDrag = useCallback(
    (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const client =
        "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const initialValue = initialMouseX.current;
      if (!containerRef.current || client === 0) return;
      if (Math.abs(client - initialValue) < 40) return;
      if (!scrollTrackRef.current || !scrollBarRef.current) return;
      const barPercent =
        scrollBarRef.current.clientWidth / scrollTrackRef.current.clientWidth;
      const deltaX = (client - initialValue) * barPercent;
      containerPosition(-deltaX);
    },
    [containerPosition]
  );

  const handleDragEnd = useCallback(() => {
    if (!containerRef.current) return;
    containerRef.current.addEventListener("scroll", handleScroll);
    document.removeEventListener("mousemove", handleDrag as any);
    document.removeEventListener("touchmove", handleDrag as any);
    document.removeEventListener("mouseup", handleDragEnd as any);
    document.removeEventListener("touchend", handleDragEnd as any);
    initialMouseX.current = 0;
    initialScrollLeft.current = 0;
  }, [handleDrag, handleScroll]);

  const handleDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const client =
        "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      if (!containerRef.current) return;
      containerRef.current.removeEventListener("scroll", handleScroll);
      document.addEventListener("mousemove", handleDrag as any);
      document.addEventListener("touchmove", handleDrag as any, { passive: false });
      document.addEventListener("mouseup", handleDragEnd as any);
      document.addEventListener("touchend", handleDragEnd as any);
      initialMouseX.current = client ?? 0;
      initialScrollLeft.current = scrollBarLeft;
    },
    [handleDrag, handleDragEnd, handleScroll, scrollBarLeft]
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    initialTouchX.current = e.touches[0]?.clientX ?? 0;
    setIsTouching(true);
  }, []);

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      const vector = event.touches[0].clientX - initialTouchX.current;
      initialTouchX.current = event.touches[0].clientX;
      containerPosition(vector);
    },
    [containerPosition]
  );

  const handleTouchEnd = useCallback(() => {
    setIsTouching(false);
  }, []);

  useEventHandler({ update: [`update.${name}`, updateScroll] }, `${name}-ScrollContainer`);

  useLayoutEffect(() => {
    setIsTouchDevice("ontouchstart" in window);
    setScrollBarLeft(0);
    setTranslate(0);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const currentContentWidth = container.scrollWidth;
    const containerWidth = container.clientWidth;
    const newDiffContentWidth = currentContentWidth - containerWidth;

    const isContentOverflowing = currentContentWidth > containerWidth;
    setShowBar(isContentOverflowing && (!isTouchDevice || isTouching));
    setContentWidth(currentContentWidth);
    setDiffContentWidth(newDiffContentWidth);

    const widthPercent = containerWidth / (currentContentWidth || 1);
    setScrollBarWidth(Math.max(Math.min(widthPercent * 100, 90), 20));
    eventHandler.dispatch(name, {
      [name]: {
        position: Math.abs(initialTranslate.current),
        percentage:
          newDiffContentWidth === 0
            ? 0
            : Math.abs(initialTranslate.current / newDiffContentWidth),
        size: newDiffContentWidth,
      },
    });
  }, [
    name,
    breakpoint,
    orientation,
    width,
    height,
    isTouchDevice,
    isTouching,
    children,
  ]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart as any);
    container.addEventListener("touchmove", handleTouchMove as any, { passive: false });
    container.addEventListener("touchend", handleTouchEnd as any);
    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart as any);
      container.removeEventListener("touchmove", handleTouchMove as any);
      container.removeEventListener("touchend", handleTouchEnd as any);
    };
  }, [handleWheel, handleTouchEnd, handleTouchMove, handleTouchStart]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll, scrollBarWidth, contentWidth]);

  useEffect(() => {
    return () => {
      if (changeTimeout.current) clearTimeout(changeTimeout.current);
    };
  }, []);

  const scrollTrackClassName = useMemo(
    () => combineClasses(scrollTrackClasses),
    [scrollTrackClasses]
  );
  const scrollBarClassName = useMemo(
    () => combineClasses("cursor-pointer", scrollBarClasses),
    [scrollBarClasses]
  );

  const styleScrollBar: React.CSSProperties = {
    height: "100%",
    backgroundColor: "#888",
    ...scrollBarStyle,
    width: `${scrollBarWidth}%`,
    marginLeft: `${scrollBarLeft * 100}%`,
  };

  return (
    <>
      <div style={{ overflowX: "clip" }}>
        <div
          ref={containerRef}
          id={`${name}-container`}
          style={{
            paddingBottom: "2rem",
            marginBottom: "-2rem",
            transform: `translate(${translate}px)`,
            ["--dbl-scroll-x-position" as any]: `${Math.abs(translate)}px`,
          }}
        >
          {children}
        </div>
      </div>
      {showBar && (
        <div
          className={scrollTrackClassName}
          ref={scrollTrackRef}
          style={{
            bottom: 0,
            left: 0,
            right: 0,
            height: "20px",
            backgroundColor: "#ccc",
            ...scrollTrackStyle,
            position: "sticky",
          }}
        >
          <div
            ref={scrollBarRef}
            className={scrollBarClassName}
            style={styleScrollBar}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            role="scrollbar"
            aria-controls={`${name}-container`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percentage * 100}
            tabIndex={0}
          />
        </div>
      )}
    </>
  );
};

export interface ScrollContainerProps extends ContainerProps {
  scrollTrackClasses?: Classes;
  scrollBarClasses?: Classes;
  scrollTrackStyle?: React.CSSProperties;
  scrollBarStyle?: React.CSSProperties;
}

export default class ScrollContainer extends Container {
  declare props: ScrollContainerProps;

  static override jsClass = "ScrollContainer";

  override content(children: React.ReactNode = this.props.children): React.ReactNode {
    const {
      scrollTrackClasses,
      scrollBarClasses,
      scrollTrackStyle,
      scrollBarStyle,
    } = this.props;
    return (
      <ScrollXNode
        name={this.props.name}
        breakpoint={this.breakpoint}
        orientation={this.orientation}
        width={this.width}
        height={this.height}
        scrollTrackClasses={scrollTrackClasses}
        scrollBarClasses={scrollBarClasses}
        scrollTrackStyle={scrollTrackStyle}
        scrollBarStyle={scrollBarStyle}
      >
        {children}
      </ScrollXNode>
    );
  }
}
