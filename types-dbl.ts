export interface ControllerState {
  localClasses: string;
  localStyles: object;
}

export interface IconsProps {
  iconSet: object;
  color?: string;
  size?: string | number;
  icon: string;
}

export interface ComponentProps extends React.PropsWithChildren {
  name: string,
  classes: string | string[],
  label: React.ReactNode,
  style: {
    [key: string]: any
  },
  _props: object,
}

export interface IColumn {

}

export interface IPropsTable extends ComponentProps {
  columns: IColumn[] | Record<string, IColumn>;
  headerCustom: any;
}

export interface JrcProps extends ComponentProps {
  view: object;
  childrenIn: string | string[];
  definitions: object;
}