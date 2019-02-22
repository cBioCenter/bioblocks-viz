import * as React from 'react';
import { Button, Grid, Icon, Label, Menu, Sidebar, SidebarProps } from 'semantic-ui-react';

import { BioblocksRadioGroup, BioblocksSlider } from '~bioblocks-viz~/component';
import {
  BioblocksWidgetConfig,
  ButtonWidgetConfig,
  CONFIGURATION_COMPONENT_TYPE,
  LabelWidgetConfig,
  RadioWidgetConfig,
  SliderWidgetConfig,
} from '~bioblocks-viz~/data';

export interface ISettingsPanelState {
  visible: boolean;
}

// We are omitting the 'width' prop from the Semantic Sidebar to instead use our own so an exact width may be specified.
export type SettingsPanelProps = {
  configurations: BioblocksWidgetConfig[];
  direction?: 'top' | 'right' | 'bottom' | 'left';
  inverted?: boolean;
  opacity?: number;
  showConfigurations?: boolean;
  width?: number | string;
} & Partial<Omit<SidebarProps, 'width'>>;

export class SettingsPanel extends React.Component<SettingsPanelProps, ISettingsPanelState> {
  public static defaultProps = {
    configurations: new Array<BioblocksWidgetConfig>(),
    direction: 'left',
    inverted: true,
    opacity: 0.6,
    showConfigurations: true,
    width: '100%',
  };

  protected panel: HTMLDivElement | null = null;

  constructor(props: SettingsPanelProps) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  public componentDidUpdate(prevProps: SettingsPanelProps, prevState: ISettingsPanelState) {
    const { visible } = this.state;
    if (visible && prevState.visible !== visible) {
      window.addEventListener('click', e => {
        if (this.panel) {
          const panelRect = this.panel.getBoundingClientRect();

          const { x, y } = e;
          const isIntersected =
            x >= panelRect.left && x <= panelRect.right && y >= panelRect.top && y <= panelRect.bottom;

          if (!isIntersected) {
            this.hideSettingsPanel();
            window.removeEventListener('click', this.hideSettingsPanel);
          }
        }
      });
    } else {
      window.removeEventListener('click', e => this.hideSettingsPanel);
    }
  }

  public render() {
    const { children, configurations, inverted, opacity, showConfigurations, width } = this.props;
    const { visible } = this.state;

    return (
      <div ref={node => (this.panel = node ? node : null)}>
        <Grid columns={1}>
          {showConfigurations && <Grid.Column>{this.renderSettingsButton()}</Grid.Column>}
          <Sidebar.Pushable style={{ height: '100%', width }}>
            <Sidebar
              as={Menu}
              animation={'overlay'}
              inverted={inverted}
              style={{ opacity, width }}
              vertical={true}
              visible={visible}
            >
              {this.renderConfigurations(configurations)}
            </Sidebar>
            <Sidebar.Pusher>{children}</Sidebar.Pusher>
          </Sidebar.Pushable>
        </Grid>
      </div>
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
