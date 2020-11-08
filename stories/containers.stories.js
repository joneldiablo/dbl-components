import React from "react";
import AspectRatioContainer from "../src/js/containers/aspect-ratio-container";
import FullscreenContainer from "../src/js/containers/fullscreen-container";
import '../src/scss/style.scss';
import './assets/scss/containers.scss';

export default {
  title: 'Diablo components/Containers'
};

export const Fullscreen = () => <FullscreenContainer >
  <div style={{ height: '100%', background: 'aqua' }}>Contenedor del alto de pantalla</div>
</FullscreenContainer >;

export const Proportional = () => <div style={{ width: 100 }}>
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