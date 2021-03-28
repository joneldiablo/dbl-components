import React, { useEffect, useState } from "react";
import ProportionalContainer from "../src/js/containers/proportional-container";
import FullscreenContainer from "../src/js/containers/fullscreen-container";
import AutoResponsiveContainer from "../src/js/containers/auto-responsive-container";
import GridContainer from "../src/js/containers/grid-container";

export default {
  title: 'Diablo components/Containers',
  decorators: [(Story) => {
    require('./assets/scss/containers.scss');
    return <Story />
  }]
};

export const Fullscreen = () => <FullscreenContainer >
  <div style={{ height: '100%', background: 'aqua' }}>Contenedor del alto de pantalla</div>
</FullscreenContainer >;

export const Proportional = () => <div style={{ width: 100 }}>
  <ProportionalContainer >
    Contenedor proporcional 1:1
  </ProportionalContainer>
  <hr />
  <ProportionalContainer ratio={2 / 3}>
    Contenedor proporcional 2:1
  </ProportionalContainer>
  <hr />
  <ProportionalContainer ratio={1 / 2}>
    Contenedor proporcional 3:2
  </ProportionalContainer>
</div>;

export const AutoResponsiveByEvent = () => {
  const rId = 'resize-container';
  const [size, setSize] = useState({
    width: 0,
    height: 0
  });
  let [wOut, setWOut] = useState(300);
  let [hIn, setHIn] = useState(300);

  const onResize = (e) => {
    setSize(e.detail);
  }

  useEffect(() => {
    let $resizeContainer = document.getElementById(rId);
    $resizeContainer.addEventListener('resize', onResize);
  }, []);



  return <div>
    <label htmlFor="hin">Width outside: <input id="hin" type="number" onChange={e => setWOut(e.target.value)} value={wOut} />px</label>
    <br />
    <label htmlFor="hin">Height inside: <input id="hin" type="number" onChange={e => setHIn(e.target.value)} value={hIn} />px</label>
    <br />
    <div style={{ maxWidth: parseInt(wOut) }}>
      <AutoResponsiveContainer id={rId}>
        <div style={{ height: parseInt(hIn), background: 'aqua' }}>
          <ul>
            <li>width: {size.width}&nbsp;
              {wOut && <small>(wOut:{wOut}px)</small>}
            </li>
            <li>height: {size.height}px&nbsp;
              {hIn && <small>(hIn:{hIn}px)</small>}
            </li>
          </ul>
        </div>
      </AutoResponsiveContainer>
    </div>
  </div>

};

export const AutoResponsiveByCallback = () => {
  const [size, setSize] = useState({
    width: 0,
    height: 0
  });
  let [wOut, setWOut] = useState(300);
  let [hIn, setHIn] = useState(300);

  const onResize = (e) => {
    console.log(e);
    setSize(e);
  }
  return <div>
    <label htmlFor="hin">Width outside: <input id="hin" type="number" onChange={e => setWOut(e.target.value)} value={wOut} />px</label>
    <br />
    <label htmlFor="hin">Height inside: <input id="hin" type="number" onChange={e => setHIn(e.target.value)} value={hIn} />px</label>
    <br />
    <div style={{ maxWidth: parseInt(wOut) }}>
      <AutoResponsiveContainer onResize={onResize}>
        <div style={{ height: parseInt(hIn), background: 'aqua' }}>
          <ul>
            <li>width: {size.width}px&nbsp;
              {wOut && <small>(wOut:{wOut}px)</small>}
            </li>
            <li>height: {size.height}px&nbsp;
              {hIn && <small>(hIn:{hIn}px)</small>}
            </li>
          </ul>
        </div>
      </AutoResponsiveContainer>
    </div>
  </div>
}

const colContent = Array(5).fill('')
  .map((e, i) => <div key={i} className="border text-center">{i + 1}</div>);

export const Grid = () => {
  return <GridContainer colClassNames="col-3" className="gy-4">
    {colContent}
  </GridContainer>
}

export const GridFirstAuto = () => {
  return <GridContainer colClassNames={['col-auto', 'col-4']} className="gy-4">
    {colContent}
  </GridContainer>
}