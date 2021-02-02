import React, { createRef } from "react";
import Component from "../component";

export default class YoutubeVideoComponent extends Component {

  static defaultProps = {
    ...Component.defaultProps,
    width: '100%',
    height: 'auto'
  }

  content(children = this.props.children) {
    const { width, height } = this.props;
    return <>
      <iframe width={width} height={height} src="https://youtu.be/embed/vgXw0H-jhUg" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      {children}
    </>;
  }

}


