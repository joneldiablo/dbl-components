import React from "react";
import PropTypes from "prop-types";
import YouTube from "react-youtube";
import Component from "../component";
import AspectRatioContainer from "../containers/aspect-ratio-container";

export default class YoutubeVideoComponent extends Component {

  static propTypes = {
    ...Component.propTypes,
    ratio: PropTypes.number,
    // TODO: ajustar los proptypes según la página de propiedades
    // https://developers.google.com/youtube/player_parameters
    youtubeOpts: PropTypes.shape({
      autoplay: PropTypes.oneOf([0, 1, '0', '1']),
      cc_load_policy: PropTypes.oneOf([1, '1']),
      color: PropTypes.string,
      controls: PropTypes.oneOf([0, 1, 2, '0', '1', '2']),
      disablekb: PropTypes.oneOf([0, 1, '0', '1']),
      enablejsapi: PropTypes.string,
      end: PropTypes.number,
      fs: PropTypes.string,
      hl: PropTypes.string,
      iv_load_policy: PropTypes.string,
      list: PropTypes.string,
      listType: PropTypes.string,
      loop: PropTypes.string,
      modestbranding: PropTypes.string,
      origin: PropTypes.string,
      playlist: PropTypes.string,
      playsinline: PropTypes.string,
      rel: PropTypes.string,
      showinfo: PropTypes.string,
      start: PropTypes.string
    }),
    videoId: PropTypes.string.isRequired,
    className: PropTypes.string,
    containerClassName: PropTypes.string,
    onReady: PropTypes.func,
    onPlay: PropTypes.func,
    onPause: PropTypes.func,
    onEnd: PropTypes.func,
    onError: PropTypes.func,
    onStateChange: PropTypes.func,
    onPlaybackRateChange: PropTypes.func,
    onPlaybackQualityChange: PropTypes.func
  }

  static defaultProps = {
    ...Component.defaultProps,
    ratio: 2 / 3
  }

  content(children = this.props.children) {
    const { ratio, overflow, youtubeOpts,
      videoId, ytbClasses, ytbContainerClasses,
      onReady, onPlay, onPause, onEnd,
      onError, onStateChange, onPlaybackRateChange,
      onPlaybackQualityChange } = this.props;
    const propsYoutube = {
      videoId,
      id: videoId,
      className: ytbClasses,
      containerClassName: ['h-100 w-100', ytbContainerClasses].join(' '),
      onReady,
      onPlay,
      onPause,
      onEnd,
      onError,
      onStateChange,
      onPlaybackRateChange,
      onPlaybackQualityChange,
      opts: {
        height: '100%',
        width: '100%',
        playerVars: youtubeOpts,
      }
    }
    return <AspectRatioContainer ratio={ratio} overflow={overflow}>
      {videoId && <YouTube {...propsYoutube} />}
      {children}
    </AspectRatioContainer>;
  }

}


