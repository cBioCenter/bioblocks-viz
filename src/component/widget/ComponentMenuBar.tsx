import * as React from 'react';
import { Button, Grid, Icon, Label, Menu, Popup, PopupProps, SemanticICONS } from 'semantic-ui-react';

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
  configs?: BioblocksWidgetConfig[];
  name: 'POPUP';
  props?: PopupProps;
}

export interface IComponentMenuBarItem<T = IPopupType> {
  component: T;
  description: string;
  iconName?: SemanticICONS;
}

export const DEFAULT_POPUP_PROPS: Partial<PopupProps> = {
  closeOnPortalMouseLeave: false,
  closeOnTriggerClick: true,
  closeOnTriggerMouseLeave: false,
  hoverable: false,
  openOnTriggerClick: true,
  openOnTriggerFocus: false,
  openOnTriggerMouseEnter: false,
  position: 'bottom center',
  // style: { maxHeight: '350px', opacity: 0.85, overflow: 'auto', zIndex: 3 },
};

export class ComponentMenuBar extends React.Component<IComponentMenuBarProps, IComponentMenuBarState> {
  public static defaultProps = {
    configurations: new Array<BioblocksWidgetConfig>(),
    height: '100%',
    isExpanded: false,
    menuItems: [],
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

    return (
      <div onMouseEnter={this.onMenuEnter} onMouseLeave={this.onMenuLeave}>
        <Menu secondary={true} style={{ margin: 0, height }} widths={2}>
          <Menu secondary={true} widths={1}>
            <Menu.Item fitted={'horizontally'} position={'left'} style={{ margin: 0, padding: 0 }}>
              {iconSrc && (
                <img alt={'component icon'} src={iconSrc} style={{ height: '32px', padding: '2px', width: '32px' }} />
              )}
              {componentName}
            </Menu.Item>
          </Menu>
          <Menu secondary={true} widths={4}>
            {this.renderMenuItems(menuItems, componentName)}
            <Menu.Item fitted={'horizontally'} position={'right'} style={{ flexDirection: 'column' }}>
              <Icon name={isExpanded ? 'compress' : 'expand arrows alternate'} onClick={onExpandToggleCb} />
              {this.renderMenuIconText(isExpanded ? 'Close' : 'Expand')}
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
      <Button compact={true} key={id} onClick={config.onClick} style={config.style}>
        {config.icon && <Icon name={config.icon} />}
        {config.name}
      </Button>
    );
  }

  protected renderConfigurationLabel(config: LabelWidgetConfig, id: string) {
    return (
      <Label basic={true} key={id} style={config.style} color={'orange'}>
        {config.name}
      </Label>
    );
  }

  protected renderConfigurationRadioButton(config: RadioWidgetConfig, id: string) {
    return (
      <BioblocksRadioGroup
        defaultOption={config.defaultOption}
        id={id}
        key={id}
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
        key={id}
        label={config.name}
        defaultValue={config.values.defaultValue}
        max={config.values.max}
        min={config.values.min}
        onAfterChange={config.onAfterChange}
        onChange={config.onChange}
        style={{ padding: '0 18px', width: '100%', ...config.style }}
        value={config.values.current}
      />
    );
  }

  protected renderMenuIconText(text: string) {
    const { isHovered } = this.state;

    return <span style={{ fontSize: '11px', visibility: isHovered ? 'visible' : 'hidden' }}>{text}</span>;
  }

  protected renderMenuItems(items: IComponentMenuBarItem[], componentName: string) {
    return items.map((item, menuBarIndex) => {
      // We are separating the style to prevent a bug where the popup arrow does not display if overflow is set.
      const { style, ...combinedProps } = { ...DEFAULT_POPUP_PROPS, ...item.component.props };

      let menuItemChild = null;
      if (item.component.name === 'POPUP') {
        const trigger = <Icon name={item.iconName ? item.iconName : 'setting'} />;
        menuItemChild = item.component.configs ? (
          <Popup trigger={trigger} {...combinedProps} wide={true}>
            <Grid centered={true} divided={'vertically'} style={style}>
              {item.component.configs.map((config, configIndex) => (
                <Grid.Row columns={1} key={`menu-bar-${menuBarIndex}-row-${configIndex}`} style={{ padding: '7px 0' }}>
                  {this.renderConfig(config, `${menuBarIndex}-${configIndex}`)}
                </Grid.Row>
              ))}
            </Grid>
          </Popup>
        ) : (
          <Popup trigger={trigger} {...combinedProps} />
        );
      }

      return (
        menuItemChild && (
          <Menu.Item
            fitted={'horizontally'}
            key={`${componentName}-menu-item-${menuBarIndex}`}
            position={'right'}
            style={{ flexDirection: 'column' }}
          >
            {menuItemChild}
            {this.renderMenuIconText(item.description)}
          </Menu.Item>
        )
      );
    });
  }
}
