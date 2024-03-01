import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

export default function ScrollX({
  tag = 'div',
  classes = [], scrollTrackClasses = [], scrollBarClasses = [],
  style = {}, scrollTrackStyle = {}, scrollBarStyle = {},
  children
}) {

  const lastTouchXRef = useRef(0);
  const containerRef = useRef(null);
  const scrollTrackRef = useRef(null);
  const lastTimeRef = useRef(null);

  const [velocity, setVelocity] = useState(0); // Velocidad del desplazamiento durante el touch
  const [timeoutTouchEnd, setTimeoutTouchEnd] = useState(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isTouchMove, setIsTouchMove] = useState(false);
  const [marginLeft, setMarginLeft] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [startX, setStartX] = useState(0);
  const [scrollBarLeft, setScrollBarLeft] = useState(0);
  const [wScrollBar, setWScrollBar] = useState(0);

  const applyInertia = () => {
    let friction = 0.95; // Coeficiente de fricción para simular la desaceleración
    const inertia = () => {
      if (Math.abs(velocity) > 0.1) {
        updateMarginLeft(velocity * 10); // Multiplicamos la velocidad para aumentar el efecto
        setVelocity(velocity * friction); // Aplicamos fricción a la velocidad
        requestAnimationFrame(inertia); // Continúa aplicando la inercia
      }
    };
    requestAnimationFrame(inertia);
  };

  useLayoutEffect(() => {
    return () => clearTimeout(timeoutTouchEnd);
  }, []);

  // Detect touch device
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window);
  }, [containerRef.current?.offsetWidth]);

  // Update container and content width
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      setContainerWidth(container.offsetWidth);
      setContentWidth(container.scrollWidth);
      const wp = container.offsetWidth / container.scrollWidth * 100;
      setWScrollBar(Math.max(wp, 20)); // Ensure scrollbar is not too small
    }
  }, [children, containerRef.current?.offsetWidth]);

  useEffect(() => {
    const scrollPercentage = Math.abs(marginLeft) / (contentWidth - containerWidth);
    setScrollBarLeft(scrollPercentage * (100 - wScrollBar)); // Use the updated wScrollBar value
  }, [marginLeft, contentWidth, containerWidth, wScrollBar]); // Depend on wScrollBar as well

  const handleTouchStart = (e) => {
    lastTimeRef.current = performance.now();
    setIsTouchMove(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    const touchX = e.touches[0].clientX;
    const dx = touchX - startX;
    setStartX(touchX);
    updateMarginLeft(dx);

    // Calcula la velocidad del movimiento
    const currentTime = performance.now();
    const timeDelta = currentTime - lastTimeRef.current;
    const newVelocity = timeDelta ? dx / timeDelta : 0;
    setVelocity(newVelocity);
    lastTouchXRef.current = touchX;
    lastTimeRef.current = currentTime; // Actualiza el timestamp del último evento touchmove 
  };

  const handleTouchEnd = (e) => {
    clearTimeout(timeoutTouchEnd);
    setTimeoutTouchEnd(setTimeout(setIsTouchMove, 1333, false));

    // Aplica la inercia basada en la velocidad calculada
    //applyInertia();
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setDragImage(new Image(), 0, 0); // Use a transparent image for dragging
    setStartX(e.clientX);
  };

  const handleDrag = (e) => {
    if (e.clientX === 0) return; // Prevents updating when drag event fires with clientX = 0
    const dx = e.clientX - startX;
    setStartX(e.clientX);
    updateScrollBarPosition(dx);
  };

  const handleWheel = (e) => {
    const wheelDelta = Math.abs(e.deltaX) === 0 && e.shiftKey ? e.deltaY : e.deltaX;
    updateMarginLeft(-wheelDelta);
  };

  // Update marginLeft based on delta movement
  const updateMarginLeft = (dx) => {
    setMarginLeft((prevMarginLeft) => {
      let newMargin = prevMarginLeft + dx;
      newMargin = Math.max(newMargin, containerWidth - contentWidth);
      newMargin = Math.min(newMargin, 0);
      return newMargin;
    });
  };

  // Actualiza la posición de scrollBarLeft basada en el movimiento del mouse
  const updateScrollBarPosition = (dx) => {
    setScrollBarLeft((prevScrollBarLeft) => {

      const scrollTrackWidth = scrollTrackRef.current.offsetWidth;
      // Transforma el desplazamiento del mouse en X a porcentaje del ancho total del contenedor
      let mouseXPercentage = (dx / scrollTrackWidth) * 100;
      // Calcula el nuevo porcentaje de posición de la barra sumando el porcentaje actual
      let newScrollBarLeft = prevScrollBarLeft + mouseXPercentage * (scrollTrackWidth - wScrollBar) / scrollTrackWidth;
      // Establece un límite mínimo para newScrollBarLeft
      newScrollBarLeft = Math.max(newScrollBarLeft, 0);
      // Establece un límite máximo para newScrollBarLeft asegurando que no exceda el ancho disponible
      newScrollBarLeft = Math.min(newScrollBarLeft, 100 - wScrollBar);

      // Calcula el nuevo marginLeft basado en la posición de scrollBarLeft
      const newMarginLeft = -((newScrollBarLeft / (100 - wScrollBar)) * (contentWidth - containerWidth));
      // Calcula el dx como la diferencia entre el nuevo marginLeft y el actual
      const marginLeftDx = newMarginLeft - marginLeft;
      // Actualiza marginLeft usando el dx calculado
      updateMarginLeft(marginLeftDx);

      return newScrollBarLeft;
    });
  };

  const Tag = tag;
  const cn = [classes];
  const stc = [scrollTrackClasses];
  const sbc = [scrollBarClasses];

  return (
    <Tag ref={containerRef} className={cn.flat().filter(c => !!c).join(' ')} style={{ ...style, overflowX: 'clip' }} onWheel={handleWheel}>
      <div
        style={{
          marginLeft: `${marginLeft}px`,
          width: 'max-content',
        }}
        {...(isTouchDevice ? { onTouchStart: handleTouchStart, onTouchMove: handleTouchMove, onTouchEnd: handleTouchEnd } : {})}
      >
        {children}
      </div>
      {(!isTouchDevice || isTouchMove) && (
        <div
          className={stc.flat().join(' ')}
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
            className={sbc.flat().join(' ')}
            style={{
              height: '100%',
              backgroundColor: '#888',
              ...scrollBarStyle,
              width: `${wScrollBar}%`,
              marginLeft: `${scrollBarLeft}%`
            }}
            draggable="true"
            onDragStart={handleDragStart}
            onDrag={handleDrag}
          />
        </div>
      )
      }
    </Tag >
  );
}
