import * as React from 'react';

import { Button, ButtonProps, Grid } from 'semantic-ui-react';
import { ToggleWidgetConfig } from '~bioblocks-viz~/data';

export interface IBioblocksToggleButtonProps {
  config: ToggleWidgetConfig;
}

export class BioblocksToggleButton extends React.Component<IBioblocksToggleButtonProps> {
  constructor(props: IBioblocksToggleButtonProps) {
    super(props);
  }

  public render() {
    const { config } = this.props;

    return (
      <Grid columns={'equal'} padded={true}>
        <Grid.Row>
          <Grid.Column verticalAlign={'middle'}>{config.name}</Grid.Column>
          <Grid.Column>
            <Button
              negative={config.currentOption === 'off'}
              onClick={this.onClick}
              positive={config.currentOption === 'on'}
              style={{ width: '100%' }}
            >
              {config.currentOption === 'on' ? config.options.on : config.options.off}
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  protected onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) => {
    const { config } = this.props;

    if (config.onChange) {
      config.onChange(event, data);
    }
  };
}
