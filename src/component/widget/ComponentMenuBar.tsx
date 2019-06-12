import * as React from 'react';
import { Button, Grid, Icon, Label, Menu, Popup, PopupProps, SemanticICONS } from 'semantic-ui-react';

import {
  BioblocksRadioGroup,
  BioblocksRangeSlider,
  BioblocksSlider,
  BioblocksToggleButton,
  ConfigAccordion,
} from '~bioblocks-viz~/component/widget';
import {
  BioblocksWidgetConfig,
  ButtonGroupWidgetConfig,
  ButtonWidgetConfig,
  CONFIGURATION_COMPONENT_TYPE,
  LabelWidgetConfig,
  RadioWidgetConfig,
  RangeSliderWidgetConfig,
  SliderWidgetConfig,
  ToggleWidgetConfig,
} from '~bioblocks-viz~/data';

export interface IComponentMenuBarProps {
  componentName: string;
  height: number | string;
  isExpanded: boolean;
  iconSrc?: string;
  menuItems: IComponentMenuBarItem[];
  opacity: number;
  width: number | string;
  onExpandToggleCb?(): void;
}

export interface IComponentMenuBarState {
  isHovered: boolean;
}

export interface IPopupType {
  configs?: { [key: string]: BioblocksWidgetConfig[] };
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
  position: 'bottom left',
  style: { marginTop: 0, maxHeight: '350px', overflow: 'auto', zIndex: 3 },
};

export class ComponentMenuBar extends React.Component<IComponentMenuBarProps, IComponentMenuBarState> {
  public static defaultProps = {
    height: '100%',
    isExpanded: false,
    menuItems: [],
    opacity: 0.85,
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

  protected renderConfigs = (configs: { [key: string]: BioblocksWidgetConfig[] }) => {
    return Object.keys(configs).map(configKey => ({
      [configKey]: configs[configKey].map((config, configIndex) => (
        <Grid.Row
          columns={1}
          key={`menu-bar-${configKey}-row-${configIndex}`}
          style={{ padding: '5px 0', width: '100%' }}
        >
          {this.renderConfig(config, `${configKey}-row-${configIndex}`)}
        </Grid.Row>
      )),
    }));
  };

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
        return this.renderConfigurationButton(config, `button-${id}`);
      case CONFIGURATION_COMPONENT_TYPE.BUTTON_GROUP:
        return this.renderConfigurationButtonGroup(config, `button-${id}`);
      case CONFIGURATION_COMPONENT_TYPE.LABEL:
        return this.renderConfigurationLabel(config, `label-${id}`);
      case CONFIGURATION_COMPONENT_TYPE.RADIO:
        return this.renderConfigurationRadioButton(config, `radio-${id}`);
      case CONFIGURATION_COMPONENT_TYPE.RANGE_SLIDER:
        return this.renderConfigurationRangeSlider(config, `range-slider-${id}`);
      case CONFIGURATION_COMPONENT_TYPE.SLIDER:
        return this.renderConfigurationSlider(config, `slider-${id}`);
      case CONFIGURATION_COMPONENT_TYPE.TOGGLE:
        return this.renderConfigurationToggle(config, `slider-${id}`);
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

  protected renderConfigurationButtonGroup(config: ButtonGroupWidgetConfig, id: string) {
    return (
      <Grid padded={true} style={{ padding: 'initial 0' }}>
        <Grid.Row columns={15}>
          <Grid.Column width={11}>{config.name}</Grid.Column>
          <Grid.Column width={4}>
            <Button.Group floated={'right'} fluid={true}>
              {config.options.map((singleConfig, index) => (
                <Button icon={singleConfig} key={`${id}-${index}`} style={config.style} basic={true} compact={true} />
              ))}
            </Button.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
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
        selectedOption={config.current}
        style={config.style}
        title={config.name}
      />
    );
  }

  protected renderConfigurationRangeSlider(config: RangeSliderWidgetConfig, id: string) {
    return (
      <BioblocksRangeSlider
        key={id}
        label={config.name}
        defaultValue={config.range.defaultRange}
        max={config.range.max}
        min={config.range.min}
        onAfterChange={config.onAfterChange}
        onChange={config.onChange}
        style={{ padding: '2px 0 3px 18px', width: '100%', ...config.style }}
        value={config.range.current}
      />
    );
  }

  protected renderConfigurationSlider(config: SliderWidgetConfig, id: string) {
    return (
      <BioblocksSlider
        key={id}
        label={config.name}
        defaultValue={config.values.defaultValue}
        marks={config.marks}
        max={config.values.max}
        min={config.values.min}
        onAfterChange={config.onAfterChange}
        onChange={config.onChange}
        step={config.step}
        style={{ padding: '2px 0 3px 18px', width: '100%', ...config.style }}
        value={config.values.current}
      />
    );
  }

  protected renderConfigurationToggle(config: ToggleWidgetConfig, id: string) {
    return <BioblocksToggleButton config={config} />;
  }

  protected renderMenuIconText(text: string) {
    const { isHovered } = this.state;

    return <span style={{ fontSize: '11px', visibility: isHovered ? 'visible' : 'hidden' }}>{text}</span>;
  }

  protected renderMenuItems(items: IComponentMenuBarItem[], componentName: string) {
    const { opacity } = this.props;

    return items.map((item, menuBarIndex) => {
      // We are separating the style to prevent a bug where the popup arrow does not display if overflow is set.
      const { style, ...combinedProps } = { ...DEFAULT_POPUP_PROPS, ...item.component.props };

      let menuItemChild = null;
      if (item.component.name === 'POPUP') {
        const trigger = <Icon name={item.iconName ? item.iconName : 'setting'} />;
        menuItemChild = item.component.configs ? (
          <Popup trigger={trigger} {...combinedProps} wide={true} style={{ opacity }}>
            <ConfigAccordion configs={this.renderConfigs(item.component.configs)} gridStyle={style} title={'Config'} />
          </Popup>
        ) : (
          <Popup trigger={trigger} {...combinedProps} style={{ opacity }} />
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
