export default class YoutubeVideoComponent extends Component {
    static propTypes: {
        ratio: any;
        youtubeOpts: any;
        videoId: any;
        className: any;
        containerClassName: any;
        onReady: any;
        onPlay: any;
        onPause: any;
        onEnd: any;
        onError: any;
        onStateChange: any;
        onPlaybackRateChange: any;
        onPlaybackQualityChange: any;
        _props: any;
        active: any;
        children: any;
        classes: any;
        name: any;
        style: any;
        tag: any;
    };
    static defaultProps: {
        ratio: number;
        classes: string;
        style: {};
        active: boolean;
    };
}
import Component from "../component";
