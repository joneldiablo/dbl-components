import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useFloating, autoUpdate, autoPlacement, FloatingArrow } from '@floating-ui/react';


import useEventHandler from '../../hooks/use-event-handler';
import eventHandler from '../../functions/event-handler';

function onOpenChange(open, event, reason) {
  //console.log(open, event, reason);
}

export default function FloatingContainer({ name, active, floatAround, children, placement, alignment, allowedPlacements, classes, styles = {} }) {
  const reference = floatAround.current
    ? (floatAround.current.ref?.current || floatAround.current)
    : floatAround;

  const selfUpdate = useCallback((update) => {
    if (update.open !== undefined) {
      setOpen(update.open);
    }
  }, []);

  const handleClickOutside = useCallback((event) => {
    if (floatingRef.current && !floatingRef.current.contains(event.target)) {
      setOpen(false);
      eventHandler.dispatch(name, { [name]: { open: false } });
    }
  }, [name]);


  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      setOpen(false);
      eventHandler.dispatch(name, { [name]: { open: false } });
    }
  }, [name]);

  const [open, setOpen] = useState(active === undefined || !!active);
  const floatingRef = useRef(null);
  const { refs, floatingStyles } = useFloating({
    elements: {
      reference
    },
    strategy: 'fixed',
    placement,
    onOpenChange,
    whileElementsMounted: autoUpdate,
    middleware: [autoPlacement({
      alignment,
      autoAlignment: !alignment,
      allowedPlacements,
    })],
  });

  useEventHandler([
    [`update.${name}`, selfUpdate]
  ], `${name}-FloatingContainer`);
  useEffect(() => {
    if (open && refs.setFloating.current) {
      refs.setFloating.current.focus();
    }
  }, [open, refs.setFloating.current]);
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClickOutside, handleKeyDown]);

  const cn = [name, name + '-FloatingContainer', 'card shadow',];
  if (classes) cn.push(classes);

  return open
    ? <div
      ref={(node) => {
        floatingRef.current = node;
        refs.setFloating(node);
      }}
      className={cn.flat().filter(Boolean).join(' ')}
      style={{ ...styles, ...floatingStyles, zIndex: 1050 }}
    >
      {children}
    </div>
    : <Fragment />
}