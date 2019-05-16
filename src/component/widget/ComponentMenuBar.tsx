import * as React from 'react';
import { Icon, Menu, Popup, PopupProps } from 'semantic-ui-react';

import { BioblocksWidgetConfig } from '~bioblocks-viz~/data';

export interface IComponentMenuBarProps {
  componentName: string;
  configurations: BioblocksWidgetConfig[];
  height: number | string;
  isExpanded: boolean;
  iconSrc?: string;
  menuItems: IComponentMenuBarItem[];
  width: number | string;
  onExpandToggleCb?(): void;
}

export interface IComponentMenuBarState {
  isHovered: boolean;
}

interface IPopupType {
  name: 'POPUP';
  props: PopupProps;
}

export interface IComponentMenuBarItem<T = IPopupType> {
  component: T;
  description: string;
}

export class ComponentMenuBar extends React.Component<IComponentMenuBarProps, IComponentMenuBarState> {
  public static defaultProps = {
    configurations: new Array<BioblocksWidgetConfig>(),
    height: '100%',
    isExpanded: false,
    menuItems: [],
    opacity: 0.6,
    width: '100%',
  };

  constructor(props: IComponentMenuBarProps) {
    super(props);
    this.state = {
      isHovered: false,
    };
  }

  public render() {
    const { componentName, height, iconSrc, isExpanded, menuItems, onExpandToggleCb } = this.props;
    const { isHovered } = this.state;

    return (
      <div onMouseEnter={this.onMenuEnter} onMouseLeave={this.onMenuLeave}>
        <Menu secondary={true} style={{ margin: 0, height }}>
          <Menu.Item position={'left'} fitted={'horizontally'} style={{ margin: 0, padding: 0 }}>
            {iconSrc && (
              <img alt={'component icon'} src={iconSrc} style={{ height: '32px', padding: '2px', width: '32px' }} />
            )}
            {componentName}
          </Menu.Item>

          <Menu floated={'right'} secondary={true}>
            {this.renderMenuItems(menuItems, componentName)}
            <Menu.Item fitted={'horizontally'} style={{ flexDirection: 'column' }}>
              <Icon name={isExpanded ? 'compress' : 'expand arrows alternate'} onClick={onExpandToggleCb} />
              <span style={{ visibility: isHovered ? 'visible' : 'hidden' }}>{isExpanded ? 'Close' : 'Expand'}</span>
            </Menu.Item>
          </Menu>
        </Menu>
      </div>
    );
  }

  protected onMenuEnter = () => {
    this.setState({
      isHovered: true,
    });
  };

  protected onMenuLeave = () => {
    this.setState({
      isHovered: false,
    });
  };

  protected renderMenuItems(items: IComponentMenuBarItem[], componentName: string) {
    const { isHovered } = this.state;

    return items.map((item, index) => {
      let menuItemChild = null;
      if (item.component.name === 'POPUP') {
        menuItemChild = <Popup {...item.component.props} />;
      }

      return (
        menuItemChild && (
          <Menu.Item
            fitted={'horizontally'}
            key={`${componentName}-menu-item-${index}`}
            style={{ flexDirection: 'column' }}
          >
            {menuItemChild}
            <span style={{ visibility: isHovered ? 'visible' : 'hidden' }}>{item.description}</span>
          </Menu.Item>
        )
      );
    });
  }
}
