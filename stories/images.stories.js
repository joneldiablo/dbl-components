import React from "react";
import Icons, { iconSet } from "../src/js/media/icons";
import Svg from "../src/js/media/svg";
import { iconList } from "react-icomoon";
import svgFile from "./assets/images/fb-messenger-icon_1.svg";
import "../src/scss/images/_icons.scss";

const is = require('./assets/font-awesome/selection.json');
iconSet(is);

export default {
  title: 'Diablo components/Images'
};

export const AnIcon = () => <Icons icon="home" />;

export const FontAwesomeIcons = () => <div>
  {iconList(is).map(icon => <span key={icon} style={{ marginRight: 10 }}>
    <Icons icon={icon} /> {icon}
  </span>)}
</div>;

export const AnIconSvg = () => (<span>
  Remember to add viewBox to the icon <Svg href={`${svgFile}#XMLID_1_`} viewBox="131 -131 512 512" /></span>);

export const IconsNotInlie = () => (<span>
  <Svg href={`${svgFile}#XMLID_1_`} viewBox="131 -131 512 512" inline={false} width="80" />
  <Icons icon="home" inline={false} width="80" />
</span>);