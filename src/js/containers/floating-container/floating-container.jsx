import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useFloating, autoPlacement } from '@floating-ui/react';
import PropTypes from "prop-types";

import { eventHandler } from 'dbl-utils';

import useEventHandler from '../../hooks/use-event-handler';
import Component from '../../component';

export default function FloatingContainer({
  name, floatAround, children, placement, card,
  alignment, allowedPlacements, classes, styles
}) {
  const [open, setOpen] = useState(false);
  const [reference, setReference] = useState();
  const floatingRef = useRef(null);
  const changeOpen = useRef(null);

  const onOpenChange = useCallback((inOpen, event, reason) => {
    eventHandler.dispatch(name, { [name]: { open: inOpen, event } });
  });

  const selfUpdate = useCallback((update, echo) => {
    if (update.open !== undefined) {
      const newOpen = update.open === 'toggle' ? !open : update.open;
      clearTimeout(changeOpen.current);
      changeOpen.current = setTimeout(() => {
        setOpen(newOpen);
        if (echo) eventHandler.dispatch(name, { [name]: { open: newOpen } });
      }, 100);
    }
  }, []);

  const handleClickOutside = useCallback((event) => {
    if (floatingRef.current && !floatingRef.current.contains(event.target)) {
      clearTimeout(changeOpen.current);
      changeOpen.current = setTimeout(() => {
        setOpen(false);
        eventHandler.dispatch(name, { [name]: { open: false } });
      }, 100);
    }
  }, [name]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      clearTimeout(changeOpen.current);
      changeOpen.current = setTimeout(() => {
        setOpen(false);
        eventHandler.dispatch(name, { [name]: { open: false } });
      }, 100);
    }
  }, [name]);

  useEffect(() => {
    setReference(!!floatAround && (
      floatAround.current
        ? (floatAround.current.ref?.current || floatAround.current)
        : floatAround
    ) || document.body);
  }, [floatAround, open]);

  const { refs, floatingStyles } = useFloating({
    elements: {
      reference,
    },
    strategy: 'fixed',
    placement,
    onOpenChange,
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

  useLayoutEffect(() => {
    return () => {
      clearTimeout(changeOpen.current);
    }
  }, []);

  const cn = [name, name + '-FloatingContainer'];
  if (classes) cn.push(classes);
  if (card) cn.push('card shadow');

  return <div>
    {open && <div
      ref={(node) => {
        floatingRef.current = node;
        refs.setFloating(node);
      }}
      className={cn.flat().filter(Boolean).join(' ')}
      style={{ ...styles, ...floatingStyles, zIndex: 1050 }}
    >
      {children}
    </div>
    }
  </div>
}

const placements = PropTypes.oneOf([
  'top', 'right', 'bottom', 'left',
  'top-start', 'right-start', 'bottom-start', 'left-start',
  'top-end', 'right-end', 'bottom-end', 'left-end',
]);

FloatingContainer.propTypes = {
  ...Component.propTypes,
  floatAround: PropTypes.any,
  placement: placements,
  alignment: PropTypes.oneOf(['start', 'end']),
  allowedPlacements: PropTypes.arrayOf(placements),
  card: PropTypes.bool
}

FloatingContainer.defaultProps = {
  ...Component.defaultProps,
  card: true
}