import * as React from 'react';
import { Button, Grid, Menu, Sidebar, SidebarProps } from 'semantic-ui-react';

import { ChellRadioGroup, ChellSlider } from '~chell-viz~/component';
import {
  ButtonWidgetConfig,
  ChellWidgetConfig,
  CONFIGURATION_COMPONENT_TYPE,
  RadioWidgetConfig,
  SliderWidgetConfig,
} from '~chell-viz~/data';

export interface ISettingsPanelState {
  visible: boolean;
}

// We are omitting the 'width' prop from the Semantic Sidebar to instead use our own so an exact width may be specified.
export type SettingsPanelProps = {
  configurations: ChellWidgetConfig[];
  showConfigurations?: boolean;
  width?: number | string;
} & Partial<Omit<SidebarProps, 'width'>>;

export class SettingsPanel extends React.Component<SettingsPanelProps, ISettingsPanelState> {
  public static defaultProps = {
    configurations: new Array<ChellWidgetConfig>(),
    direction: 'left',
    inverted: true,
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
    const { children, configurations, showConfigurations, width, ...remainingProps } = this.props;
    const { visible } = this.state;

    return showConfigurations ? (
      <div ref={node => (this.panel = node ? node : null)}>
        <Grid columns={1}>
          <Grid.Column>{this.renderSettingsButton()}</Grid.Column>
          <Sidebar.Pushable style={{ width }}>
            <Sidebar
              as={Menu}
              animation={'overlay'}
              style={{ width, opacity: 0.6 }}
              vertical={true}
              visible={visible}
              {...remainingProps}
            >
              {this.renderConfigurations(configurations)}
            </Sidebar>
            <Sidebar.Pusher>{children}</Sidebar.Pusher>
          </Sidebar.Pushable>
        </Grid>
      </div>
    ) : (
      children
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

  public renderConfigurations(configurations: ChellWidgetConfig[]) {
    return (
      <Grid centered={true}>
        {configurations.map((config, index) => {
          const id = config.id
            ? config.id
            : `${config.name
                .toLowerCase()
                .split(' ')
                .join('-')}-${index}`;
          switch (config.type) {
            case CONFIGURATION_COMPONENT_TYPE.BUTTON:
              return <Grid.Row key={id}>{this.renderConfigurationButton(config, id)}</Grid.Row>;
            case CONFIGURATION_COMPONENT_TYPE.RADIO:
              return <Grid.Row key={id}>{this.renderConfigurationRadioButton(config, id)}</Grid.Row>;
            case CONFIGURATION_COMPONENT_TYPE.SLIDER:
              return <Grid.Row key={id}>{this.renderConfigurationSlider(config, id)}</Grid.Row>;
            default: {
              return <Grid.Row key={id}>{`configuration for ${id}`}</Grid.Row>;
            }
          }
        })}
      </Grid>
    );
  }

  public renderConfigurationButton(config: ButtonWidgetConfig, id: string) {
    return (
      <Button compact={true} id={id} onClick={config.onClick} style={{ ...config.style }}>
        {config.name}
      </Button>
    );
  }

  public renderConfigurationRadioButton(config: RadioWidgetConfig, id: string) {
    return (
      <ChellRadioGroup
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
      <ChellSlider
        className={id}
        label={config.name}
        max={config.values.max}
        min={config.values.min}
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
