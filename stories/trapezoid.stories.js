import React from "react";
import Trapezoid from "../src/js/draw/trapezoid";

export default {
  title: 'Diablo components/drawing',
  component: Trapezoid
};

const Template = (args) => <Trapezoid {...args} />;

export const trapezoidWithoutData = Template.bind({});

export const trapezoidWithData = Template.bind({});
trapezoidWithData.args = {
  sideB: 100,
  high: 100,
  sideA: 200
}


