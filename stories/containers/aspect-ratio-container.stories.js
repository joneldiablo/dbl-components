import React from "react";
import AspectRatioContainer from "../../src/js/containers/aspect-ratio-container";

export default {
  title: 'containers/aspect-ratio-container',
  component: AspectRatioContainer
};

 const Template = () => <div style={{ width: 100 }}>
  <AspectRatioContainer >
    Contenedor proporcional 1:1
  </AspectRatioContainer>
  <hr />
  <AspectRatioContainer ratio={2 / 3}>
    Contenedor proporcional 2:1
  </AspectRatioContainer>
  <hr />
  <AspectRatioContainer ratio={1 / 2}>
    Contenedor proporcional 3:2
  </AspectRatioContainer>
</div>;

export const demoARC = Template.bind({});




