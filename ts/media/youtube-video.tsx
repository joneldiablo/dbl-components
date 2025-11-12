import React from "react";
import YouTube, { YouTubeProps, PlayerVars } from "react-youtube";

import Component, { ComponentProps } from "../component";
import ProportionalContainer from "../containers/proportional-container";

export interface YoutubeVideoProps extends ComponentProps {
  ratio?: number;
  youtubeOpts?: PlayerVars;
  videoId: string;
  className?: string;
  containerClassName?: string;
  ytbClasses?: string;
  ytbContainerClasses?: string;
  overflow?: string;
  onReady?: YouTubeProps["onReady"];
  onPlay?: YouTubeProps["onPlay"];
  onPause?: YouTubeProps["onPause"];
  onEnd?: YouTubeProps["onEnd"];
  onError?: YouTubeProps["onError"];
  onStateChange?: YouTubeProps["onStateChange"];
  onPlaybackRateChange?: YouTubeProps["onPlaybackRateChange"];
  onPlaybackQualityChange?: YouTubeProps["onPlaybackQualityChange"];
}

export default class YoutubeVideoComponent extends Component<YoutubeVideoProps> {
  static jsClass = "YoutubeVideoComponent";
  static defaultProps: Partial<YoutubeVideoProps> = {
    ...Component.defaultProps,
    ratio: 2 / 3,
  };

  content(children: React.ReactNode = this.props.children): React.ReactNode {
    const {
      ratio,
      overflow,
      youtubeOpts,
      videoId,
      ytbClasses,
      ytbContainerClasses,
      onReady,
      onPlay,
      onPause,
      onEnd,
      onError,
      onStateChange,
      onPlaybackRateChange,
      onPlaybackQualityChange,
    } = this.props;
    const propsYoutube: YouTubeProps = {
      videoId,
      id: videoId,
      className: ytbClasses,
      containerClassName: ["h-100 w-100", ytbContainerClasses]
        .flat()
        .join(" "),
      onReady,
      onPlay,
      onPause,
      onEnd,
      onError,
      onStateChange,
      onPlaybackRateChange,
      onPlaybackQualityChange,
      opts: {
        height: "100%",
        width: "100%",
        playerVars: youtubeOpts,
      },
    };
    return React.createElement(
      ProportionalContainer as any,
      { ratio, overflow, fullWidth: true },
      videoId && React.createElement(YouTube, propsYoutube),
      children
    );
  }
}
