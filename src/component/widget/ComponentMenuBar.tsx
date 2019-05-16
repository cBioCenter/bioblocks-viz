import * as React from 'react';
import { Button, Icon, Label, Menu, Popup, PopupProps } from 'semantic-ui-react';

import { BioblocksRadioGroup, BioblocksSlider } from '~bioblocks-viz~/component/widget';
import {
  BioblocksWidgetConfig,
  ButtonWidgetConfig,
  CONFIGURATION_COMPONENT_TYPE,
  LabelWidgetConfig,
  RadioWidgetConfig,
  SliderWidgetConfig,
} from '~bioblocks-viz~/data';

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
  props?: PopupProps;
}

interface ISidebarType {
  configs: BioblocksWidgetConfig[];
  name: 'SIDEBAR';
  props?: PopupProps;
}

export interface IComponentMenuBarItem<T = IPopupType | ISidebarType> {
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

  protected renderConfig(config: BioblocksWidgetConfig, id: string) {
    switch (config.type) {
      case CONFIGURATION_COMPONENT_TYPE.BUTTON:
        return this.renderConfigurationButton(config, id);
      case CONFIGURATION_COMPONENT_TYPE.LABEL:
        return this.renderConfigurationLabel(config, id);
      case CONFIGURATION_COMPONENT_TYPE.RADIO:
        return this.renderConfigurationRadioButton(config, id);
      case CONFIGURATION_COMPONENT_TYPE.SLIDER:
        return this.renderConfigurationSlider(config, id);
      default: {
        return `configuration for ${id}`;
      }
    }
  }

  protected renderConfigurationButton(config: ButtonWidgetConfig, id: string) {
    return (
      <Button compact={true} id={id} onClick={config.onClick} style={config.style}>
        {config.icon && <Icon name={config.icon} />}
        {config.name}
      </Button>
    );
  }

  protected renderConfigurationLabel(config: LabelWidgetConfig, id: string) {
    return (
      <Label basic={true} id={id} style={config.style} color={'orange'}>
        {config.name}
      </Label>
    );
  }

  protected renderConfigurationRadioButton(config: RadioWidgetConfig, id: string) {
    return (
      <BioblocksRadioGroup
        id={id}
        options={config.options}
        onChange={config.onChange}
        style={config.style}
        title={config.name}
      />
    );
  }

  protected renderConfigurationSlider(config: SliderWidgetConfig, id: string) {
    return (
      <BioblocksSlider
        className={id}
        label={config.name}
        max={config.values.max}
        min={config.values.min}
        onAfterChange={config.onAfterChange}
        onChange={config.onChange}
        style={{ padding: '0 25px', width: '95%', ...config.style }}
        value={config.values.current}
      />
    );
  }

  protected renderMenuItems(items: IComponentMenuBarItem[], componentName: string) {
    const { isHovered } = this.state;

    return items.map((item, index) => {
      let menuItemChild = null;
      if (item.component.name === 'POPUP') {
        menuItemChild = <Popup {...item.component.props} />;
      } else if (item.component.name === 'SIDEBAR') {
        menuItemChild = (
          <Popup {...item.component.props}>
            {item.component.configs.map(config => this.renderConfig(config, `${index}`))}
          </Popup>
        );
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
