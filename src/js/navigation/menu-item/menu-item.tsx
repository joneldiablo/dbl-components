import Component, { nameSuffixes } from "../../complex-component";

import schema from "./menu-item-schema.json";

export default class MenuItem extends Component {

  static jsClass = 'MenuItem';
  static defaultProps = {
    ...Component.defaultProps,
    schema,
    exact: false,
    activeClassName: 'active',
    icon: 'circle',
    iconSize: 40,
    activeLabel: true,
    definitions: {},
    iconInline: true,
    classes: {
      '.': '',
      link: 'd-block p-2',
      badge: 'bg-danger border-light',
      icon: 'align-middle',
      label: ''
    },
    rules: {
      ...nameSuffixes(['Link', 'Icon', 'Label', 'Badge']),
      '$classesLink': ['join', ["im-link", "$data/classes/link"], ' '],
      '$classesIcon': ['join', ["me-2", "$data/classes/icon"], ' '],
      '$classesLabel': ['join', ["im-label", "$data/classes/label"], ' '],
      '$classesBadge': ['join',
        ["position-absolute translate-middle-y rounded-pill badge border d-flex justify-content-center align-items-center", "$data/classes/badge"], ' '],
      '$dataLabel': ['ignore', '$data/label']
    },
  }

  classes = 'position-relative';

  mutations(sn, s) {
    const { name } = this.props;
    switch (sn) {
      case name + 'Badge':
        const classes =
          [this.props.rules.$classesBadge[1][0], this.props.classes.badge,
          (this.props.activeLabel ? ' top-0 end-0' : ' top-0 start-0')].join(' ');
        const badgeSize = !this.props.activeLabel ? (.6 * this.props.iconSize) : 22;
        return {
          active: !!this.props.badge,
          content: this.props.badge,
          classes,
          style: {
            zIndex: 1,
            height: badgeSize,
            width: badgeSize,
            marginLeft: !this.props.activeLabel ? this.props.iconSize * .75 : 0,
            marginTop: !this.props.activeLabel ?
              this.props.iconSize :
              (this.props.iconSize + badgeSize) * .41
          }
        };
      case name + 'Icon':
        return (typeof this.props.icon === 'string') ? {
          icon: this.props.icon,
          inline: this.props.iconInline,
          style: {
            pointerEvents: 'none',
            width: this.props.iconSize,
            height: this.props.iconSize
          }
        } :
          (typeof this.props.icon === 'object' ?
            this.props.icon : { active: false });
      case name + 'Label':
        return { active: this.props.activeLabel, content: this.props.label };
      case name + 'Link':
        return {
          component: !this.props.to ? 'Component' : 'NavLink',
          tag: !this.props.to ? 'span' : undefined,
        }
      default:
        break;
    }
    return this.state[sn];
  }

}