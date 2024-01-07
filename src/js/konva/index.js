import React from "react";
import konva from "react-konva";

const kComponents = {};
Object.keys(konva).forEach(k => {
  if (/^[A-Z]$/.test(k[0])) {
    const Component = konva[k];
    kComponents[k + 'Konva'] = React.forwardRef((props, ref) => {
      const {
        active: visible,
        name: id, classes,
        _props = {}, ...konvaProps
      } = props;
      const name = !Array.isArray(classes) ? classes : classes.join(' ');

      Object.assign(konvaProps, _props, { id, name, ref, visible });
      return React.createElement(Component, konvaProps);
    });
    kComponents[k + 'Konva'].wrapper = false;
  }
});

export default kComponents;
