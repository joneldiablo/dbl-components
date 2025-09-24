import React, {
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
  forwardRef,
} from "react";
import * as KonvaModule from "react-konva";

export interface WrappedKonvaProps extends Record<string, unknown> {
  active?: boolean;
  name?: string;
  classes?: string | string[];
  _props?: Record<string, unknown>;
}

export type KonvaForwardComponent<P = WrappedKonvaProps> = ForwardRefExoticComponent<
  PropsWithoutRef<P> & RefAttributes<unknown>
> & {
  wrapper: false;
};

export type KonvaComponentRegistry = Record<string, KonvaForwardComponent>;

type KonvaExports = Record<string, React.ComponentType<Record<string, unknown>>>;

const konvaExports = KonvaModule as unknown as KonvaExports;

const konvaComponents: KonvaComponentRegistry = {};

Object.keys(konvaExports).forEach((key) => {
  if (!key || !/^[A-Z]$/.test(key[0] ?? "")) {
    return;
  }

  const Component = konvaExports[key];
  if (typeof Component !== "function") {
    return;
  }

  const Wrapped = forwardRef<unknown, WrappedKonvaProps>((props, ref) => {
    const { active: visible, name: id, classes, _props, ...rest } = props;
    const className = Array.isArray(classes) ? classes.join(" ") : classes;
    const additionalProps = (_props ?? {}) as Record<string, unknown>;

    const mergedProps: Record<string, unknown> = {
      ...rest,
      ...additionalProps,
      id,
      name: className,
      ref,
      visible,
    };

    return React.createElement(Component, mergedProps);
  }) as KonvaForwardComponent;

  Wrapped.wrapper = false;
  konvaComponents[`${key}Konva`] = Wrapped;
});

export default konvaComponents;
