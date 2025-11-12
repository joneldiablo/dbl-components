import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  autoPlacement,
  flip,
  offset as offsetMiddleware,
  useFloating,
  type Middleware,
  type OffsetOptions,
  type Placement,
} from "@floating-ui/react";
import { eventHandler } from "dbl-utils";

import Component, { type ComponentProps } from "../component";
import useEventHandler from "../hooks/use-event-handler";

const FALLBACK_Z_INDEX = 1050;

type RefWithOptionalNested = Element & {
  ref?: React.RefObject<Element | null>;
};

type FloatAroundTarget =
  | Element
  | {
      current?: Element | RefWithOptionalNested | null;
    }
  | null
  | undefined;

type FloatAroundUpdate = {
  open?: boolean | "toggle";
};

const isRefWithNested = (value: unknown): value is RefWithOptionalNested => (
  typeof value === "object" && value !== null && "ref" in value
);

const resolveFloatAround = (target: FloatAroundTarget): Element | null => {
  if (!target) return null;
  if (typeof (target as { current?: unknown }).current !== "undefined") {
    const current = (target as {
      current?: Element | RefWithOptionalNested | null;
    }).current;
    if (!current) return null;
    if (isRefWithNested(current)) {
      const nested = current.ref?.current as Element | null;
      return nested ?? current;
    }
    return current as Element;
  }
  return target as Element;
};

export interface FloatingContainerProps {
  /** Unique component name used to namespace dispatched events. */
  name: string;
  /** Element or ref that the floating content should follow. */
  floatAround?: FloatAroundTarget;
  /** Child nodes rendered inside the floating card. */
  children?: React.ReactNode;
  /** Preferred placement for the floating element. */
  placement?: Placement;
  /** Additional offset applied by Floating UI. */
  offset?: number | OffsetOptions;
  /** Alignment preference when using auto placement. */
  alignment?: "start" | "end";
  /** Restrict the available placements when using auto placement. */
  allowedPlacements?: Placement[];
  /** Fallback placements when flipping the element. */
  fallbackPlacements?: Placement[];
  /** Whether to wrap the content with Bootstrap card styling. */
  card?: boolean;
  /** Additional classes appended to the floating container. */
  classes?: ComponentProps["classes"];
  /** Inline styles merged with the computed floating styles. */
  style?: ComponentProps["style"];
}

/**
 * Floating container used to render popovers anchored to arbitrary elements.
 *
 * @example
 * ```tsx
 * <FloatingContainer name="menu" floatAround={buttonRef}>
 *   <nav>...</nav>
 * </FloatingContainer>
 * ```
 */
export default function FloatingContainer({
  name,
  floatAround,
  children,
  placement,
  card = true,
  offset,
  alignment,
  allowedPlacements,
  fallbackPlacements,
  classes = Component.defaultProps.classes,
  style = Component.defaultProps.style ?? {},
}: FloatingContainerProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [reference, setReference] = useState<Element | null>(null);
  const floatingRef = useRef<HTMLDivElement | null>(null);
  const changeOpen = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onOpenChange = useCallback(
    (inOpen: boolean, event?: Event) => {
      eventHandler.dispatch(name, { [name]: { open: inOpen, event } });
    },
    [name]
  );

  const selfUpdate = useCallback(
    (update: FloatAroundUpdate, echo?: boolean) => {
      if (typeof update.open === "undefined") return;
      const newOpen = update.open === "toggle" ? !open : update.open;
      if (changeOpen.current) clearTimeout(changeOpen.current);
      changeOpen.current = setTimeout(() => {
        setOpen(newOpen);
        if (echo) {
          eventHandler.dispatch(name, { [name]: { open: newOpen } });
        }
      }, 100);
    },
    [name, open]
  );

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (floatingRef.current && !floatingRef.current.contains(event.target as Node)) {
        if (changeOpen.current) clearTimeout(changeOpen.current);
        changeOpen.current = setTimeout(() => {
          setOpen(false);
          eventHandler.dispatch(name, { [name]: { open: false } });
        }, 100);
      }
    },
    [name]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (changeOpen.current) clearTimeout(changeOpen.current);
        changeOpen.current = setTimeout(() => {
          setOpen(false);
          eventHandler.dispatch(name, { [name]: { open: false } });
        }, 100);
      }
    },
    [name]
  );

  useEffect(() => {
    const resolved = resolveFloatAround(floatAround);
    setReference(resolved ?? document.body ?? null);
  }, [floatAround, open]);

  const middleware = useMemo(() => {
    const chain: Middleware[] = [];
    if (offset) {
      chain.push(offsetMiddleware(offset));
    }
    if (allowedPlacements?.length) {
      chain.push(
        autoPlacement({
          alignment,
          autoAlignment: !alignment,
          allowedPlacements,
        })
      );
    } else if (fallbackPlacements?.length) {
      chain.push(
        flip({
          fallbackPlacements,
        })
      );
    }
    return chain;
  }, [offset, alignment, allowedPlacements, fallbackPlacements]);

  const { refs, floatingStyles } = useFloating({
    elements: { reference },
    strategy: "fixed",
    placement,
    onOpenChange,
    middleware,
  });

  useEventHandler(
    {
      update: [`update.${name}`, selfUpdate],
    },
    `${name}-FloatingContainer`
  );

  useEffect(() => {
    if (open && refs.floating.current) {
      refs.floating.current.focus();
    }
  }, [open, refs.floating]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClickOutside, handleKeyDown]);

  useLayoutEffect(() => () => {
    if (changeOpen.current) {
      clearTimeout(changeOpen.current);
    }
  }, []);

  const classNames = [name, `${name}-FloatingContainer`];
  if (classes) {
    if (typeof classes === "string") {
      classNames.push(classes);
    } else if (Array.isArray(classes)) {
      classNames.push(classes.flat().filter(Boolean).join(" "));
    } else if (typeof classes === "object" && "." in classes) {
      classNames.push((classes as Record<string, string | undefined>)["."] ?? "");
    }
  }
  if (card) {
    classNames.push("card shadow");
  }

  const combinedStyles: React.CSSProperties = {
    ...((style ?? {}) as React.CSSProperties),
    ...floatingStyles,
    zIndex: FALLBACK_Z_INDEX,
  };

  return (
    <div>
      {open && (
        <div
          ref={(node) => {
            floatingRef.current = node;
            refs.setFloating(node);
          }}
          className={classNames.filter(Boolean).join(" ")}
          style={combinedStyles}
        >
          {children}
        </div>
      )}
    </div>
  );
}
