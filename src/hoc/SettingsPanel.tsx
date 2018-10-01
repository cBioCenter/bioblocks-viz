import * as React from 'react';
import { Button, Grid, Menu, Sidebar } from 'semantic-ui-react';

import { IContactMapConfiguration } from '../component/ContactMap';
import { ChellRadioGroup } from '../component/widget/ChellRadioGroup';
import { ChellSlider } from '../component/widget/ChellSlider';
import { CONFIGURATION_COMPONENT_TYPE, CONTACT_DISTANCE_PROXIMITY } from '../data/chell-data';

export interface ISettingsPanelState {
  visible: boolean;
}

export interface ISettingsPanelProps {
  configurations: IContactMapConfiguration[];
  width: number;
}

const withSettingsPanel = <P extends object>(WrappedComponent: React.ComponentType<P>) =>
  class SettingsPanel extends React.Component<P & ISettingsPanelProps, ISettingsPanelState> {
    public static defaultProps = {
      configurations: new Array<IContactMapConfiguration>({
        name: 'Measuring Proximity',
        onChange: () => {
          return;
        },
        type: CONFIGURATION_COMPONENT_TYPE.RADIO,
        values: {
          current: Object.values(CONTACT_DISTANCE_PROXIMITY).indexOf(CONTACT_DISTANCE_PROXIMITY.CLOSEST),
          max: 0,
          min: 1,
          options: Object.values(CONTACT_DISTANCE_PROXIMITY),
        },
      }),
    };

    constructor(props: any) {
      super(props);
      this.state = {
        visible: false,
      };
    }

    public render() {
      const { visible } = this.state;
      const style: React.CSSProperties = { width: 400 * 0.9 };

      return (
        <div>
          <Grid columns={1}>
            <Grid.Column>{this.renderSettingsButton()}</Grid.Column>
            <Sidebar.Pushable>
              <Sidebar
                as={Menu}
                animation="overlay"
                inverted={false}
                style={{ opacity: 0.5, width: '100%' }}
                vertical={true}
                visible={visible}
              >
                {this.renderConfigurations(this.props.configurations, style)}
              </Sidebar>

              <Sidebar.Pusher>
                <WrappedComponent {...this.props} />
              </Sidebar.Pusher>
            </Sidebar.Pushable>
          </Grid>
        </div>
      );
    }

    public onButtonClick = (e: React.MouseEvent) =>
      this.setState({
        visible: !this.state.visible,
      });

    public renderSettingsButton = () => (
      <Button icon={'settings'} basic={true} floated={'right'} onClick={this.onButtonClick} />
    );

    public renderConfigurations(
      configurations: IContactMapConfiguration[],
      style: React.CSSProperties[] | React.CSSProperties,
    ) {
      return configurations.map(config => {
        const id = config.name
          .toLowerCase()
          .split(' ')
          .join('-');
        switch (config.type) {
          case CONFIGURATION_COMPONENT_TYPE.SLIDER:
            return this.renderConfigurationSlider(config, id, style);
          case CONFIGURATION_COMPONENT_TYPE.RADIO:
            return this.renderConfigurationRadioButton(config, id, style);
        }
      });
    }

    public renderConfigurationSlider(
      config: IContactMapConfiguration,
      id: string,
      sliderStyle: React.CSSProperties[] | React.CSSProperties,
    ) {
      return (
        <ChellSlider
          className={id}
          key={id}
          value={config.values.current}
          label={config.name}
          max={config.values.max}
          min={config.values.min}
          onChange={config.onChange}
          style={sliderStyle}
        />
      );
    }

    public renderConfigurationRadioButton(
      config: IContactMapConfiguration,
      id: string,
      style: React.CSSProperties[] | React.CSSProperties,
    ) {
      return (
        <ChellRadioGroup
          key={`radio-group-${id}`}
          id={id}
          options={config.values.options!}
          onChange={config.onChange}
          style={style}
        />
      );
    }
  };

export { withSettingsPanel };
export default withSettingsPanel;
