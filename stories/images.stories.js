import React from "react";
import Icons from "../src/js/images/icons";
import Svg from "../src/js/images/svg";
import { iconList } from "react-icomoon";
const iconSet = require("./assets/font-awesome/selection.json");
import svgFile from "./assets/images/fb-messenger-icon_1.svg"


export default {
  title: 'Diablo components/Images'
};

export const AnIcon = () => <Icons icon="home" iconSet={iconSet} />;

export const FontAwesomeIcons = () => <div>
  {iconList(iconSet).map(icon => <span key={icon} style={{ marginRight: 10 }}>
    <Icons icon={icon} iconSet={iconSet} /> {icon}
  </span>)}
</div>;

export const AnIconSvg = () => (<span>
  Remember to add viewBox to the icon <Svg href={`${svgFile}#XMLID_1_`} viewBox="131 -131 512 512" /></span>);

export const IconsNotInlie = () => (<span>
  <Svg href={`${svgFile}#XMLID_1_`} viewBox="131 -131 512 512" inline={false} width="80" />
  <Icons icon="home" iconSet={iconSet} inline={false} width="80" />
</span>);