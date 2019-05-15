import * as React from 'react';
import { Button, Grid, Icon, Label, Menu } from 'semantic-ui-react';

import { BioblocksRadioGroup, BioblocksSlider } from '~bioblocks-viz~/component';
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
  width: number | string;
  onExpandToggleCb?(): void;
}

export interface IComponentMenuBarState {
  visible: boolean;
}

export class ComponentMenuBar extends React.Component<IComponentMenuBarProps, IComponentMenuBarState> {
  public static defaultProps = {
    configurations: new Array<BioblocksWidgetConfig>(),
    height: '100%',
    isExpanded: false,
    opacity: 0.6,
    width: '100%',
  };

  constructor(props: IComponentMenuBarProps) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  public render() {
    const { componentName, height, iconSrc, isExpanded, onExpandToggleCb } = this.props;

    return (
      <Menu secondary={true} style={{ margin: 0, height }}>
        <Menu.Item position={'left'} fitted={'horizontally'} style={{ margin: 0 }}>
          {iconSrc && (
            <img alt={'component icon'} src={iconSrc} style={{ height: '32px', padding: '2px', width: '32px' }} />
          )}
          {componentName}
        </Menu.Item>

        <Menu.Item position={'right'} fitted={'horizontally'} style={{ margin: 0 }}>
          <Icon name={isExpanded ? 'compress' : 'expand arrows alternate'} onClick={onExpandToggleCb} />
        </Menu.Item>
      </Menu>
    );
  }

  public onButtonClick = (e: React.MouseEvent) => {
    this.setState({
      visible: !this.state.visible,
    });
  };

  public renderSettingsButton = () => (
    <Button basic={true} floated={'right'} icon={'settings'} onClick={this.onButtonClick} />
  );

  public renderConfigurations(configurations: BioblocksWidgetConfig[]) {
    return (
      <Grid relaxed={true} centered={true} columns={1} padded={true} stretched={true} style={{ height: '100%' }}>
        {configurations.map((config, index) => {
          const id = config.id
            ? config.id
            : `${config.name
                .toLowerCase()
                .split(' ')
                .join('-')}-${index}`;

          return (
            <Grid.Row key={id} style={{ padding: '10px' }}>
              {this.renderConfig(config, id)}
            </Grid.Row>
          );
        })}
      </Grid>
    );
  }

  public renderConfig(config: BioblocksWidgetConfig, id: string) {
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

  public renderConfigurationButton(config: ButtonWidgetConfig, id: string) {
    return (
      <Button compact={true} id={id} onClick={config.onClick} style={{ ...config.style, color: 'black' }}>
        {config.icon && <Icon name={config.icon} />}
        {config.name}
      </Button>
    );
  }

  public renderConfigurationLabel(config: LabelWidgetConfig, id: string) {
    return (
      <Label basic={true} id={id} style={{ ...config.style }} color={'orange'}>
        {config.name}
      </Label>
    );
  }

  public renderConfigurationRadioButton(config: RadioWidgetConfig, id: string) {
    return (
      <BioblocksRadioGroup
        id={id}
        options={config.options}
        onChange={config.onChange}
        style={{ color: 'white', ...config.style }}
        title={config.name}
      />
    );
  }

  public renderConfigurationSlider(config: SliderWidgetConfig, id: string) {
    return (
      <BioblocksSlider
        className={id}
        label={config.name}
        max={config.values.max}
        min={config.values.min}
        onAfterChange={config.onAfterChange}
        onChange={config.onChange}
        style={{ color: 'white', padding: '0 25px', width: '95%', ...config.style }}
        value={config.values.current}
      />
    );
  }

  protected hideSettingsPanel() {
    this.setState({
      visible: false,
    });
  }
}
