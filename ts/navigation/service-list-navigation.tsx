import React from "react";
import { NavLink } from "react-router-dom";
import urlJoin from "url-join";

import Icons from "../media/icons";

export interface ServiceListNavigationProps {
  className?: string | string[];
  iconDefault?: string;
  iconFrom?: string;
  iconSize?: number | string;
  labelFrom?: string;
  pathFrom?: string;
  style?: React.CSSProperties;
  url?: string;
  location?: { pathname: string };
}

interface ServiceListNavigationState {
  menu: Record<string, any>;
  stick: boolean;
  icon: string;
}

export default class ServiceListNavigation extends React.Component<
  ServiceListNavigationProps,
  ServiceListNavigationState
> {
  static jsClass = "ServiceListNavigation";

  static defaultProps: ServiceListNavigationProps = {
    url: "",
    iconSize: 40,
    iconDefault: "image",
    iconFrom: "icon",
    labelFrom: "label",
    pathFrom: "id",
    className: "",
    style: {},
  };

  state: ServiceListNavigationState = {
    menu: {},
    stick: false,
    icon: "chevron-right",
  };

  stick = (): void => {
    this.setState(({ stick }) => ({
      stick: !stick,
      icon: !stick ? "thumb-tack" : "chevron-right",
    }));
  };

  path: string;

  constructor(props: ServiceListNavigationProps) {
    super(props);
    const pathname = props.location?.pathname || "";
    const rex = pathname.substr(pathname.lastIndexOf("/")) + "$";
    this.path = pathname.replace(new RegExp(rex), "");
  }

  componentWillMount(): void {
    if (!this.props.url) return;
    fetch(this.props.url)
      .then((r) => r.json())
      .then((payload) => {
        this.setState({ menu: payload });
      });
  }

  render(): React.ReactNode {
    const {
      iconDefault,
      iconSize,
      iconFrom,
      labelFrom,
      pathFrom,
      className,
      style,
    } = this.props;
    const { menu, stick, icon } = this.state;
    const cn = [ServiceListNavigation.jsClass, className];
    if (stick) cn.push("stick");
    return (
      <div className={cn.flat().join(" ")} style={style}>
        <ul className="nav flex-column">
          <li className="nav-item">
            <div className="nav-link clearfix px-0">
              <div
                style={{ width: iconSize, height: iconSize }}
                className="d-flex justify-content-end align-items-center float-right"
              >
                <span className="wrap-collapse-arrow" style={{ cursor: "pointer" }} onClick={this.stick}>
                  <Icons icon={icon} className="collapse-arrow" />
                </span>
              </div>
            </div>
          </li>
          {Object.entries(menu).map(([i, item]) => (
            <li className="nav-item" key={i}>
              <NavLink
                to={urlJoin(this.path, String(item[pathFrom!]))}
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
                end
              >
                {item[iconFrom!] ? (
                  <img
                    src={item[iconFrom!]}
                    width={Number(iconSize)}
                    height={Number(iconSize)}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <Icons
                    icon={iconDefault}
                    inline={false}
                    width={Number(iconSize)}
                    height={Number(iconSize)}
                  />
                )}
                <span className="text-collapse text-nowrap">{item[labelFrom!]}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

