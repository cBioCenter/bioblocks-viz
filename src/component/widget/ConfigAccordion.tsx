import * as React from 'react';
import { Accordion, AccordionTitleProps, Grid, Icon } from 'semantic-ui-react';

import { BIOBLOCKS_CSS_STYLE } from '~bioblocks-viz~/data';

export interface IConfigGroup {
  [key: string]: JSX.Element[];
}

export interface IConfigAccordionProps {
  allowMultipleOpen: boolean;
  configs: IConfigGroup[];
  gridStyle: BIOBLOCKS_CSS_STYLE;
  title: string;
}

export interface IConfigAccordionState {
  activeIndices: Array<string | number>;
}

export class ConfigAccordion extends React.Component<IConfigAccordionProps, IConfigAccordionState> {
  public static defaultProps = {
    allowMultipleOpen: false,
    gridStyle: {},
  };

  constructor(props: IConfigAccordionProps) {
    super(props);
    this.state = {
      activeIndices: props.configs.length === 1 ? [0] : [],
    };
  }

  public render() {
    const { configs, gridStyle } = this.props;
    const { activeIndices } = this.state;

    return (
      <Accordion>
        <Grid padded={true} stretched={true} style={gridStyle}>
          {configs.map((config, index) =>
            Object.keys(config).map(configKey => (
              <Grid.Row key={`accordion-${configKey}`} textAlign={'left'}>
                <Accordion.Title
                  active={activeIndices.includes(index)}
                  index={index}
                  key={`${configKey}-title`}
                  onClick={this.onClick}
                  style={{ textAlign: 'left' }}
                >
                  <Icon name={'dropdown'} />
                  {configKey}
                </Accordion.Title>
                <Accordion.Content
                  active={activeIndices.includes(index)}
                  key={`${configKey}-content`}
                  style={{ width: '100%' }}
                >
                  {this.renderSingleConfig(Object.entries(configs)[index])}
                </Accordion.Content>
              </Grid.Row>
            )),
          )}
        </Grid>
      </Accordion>
    );
  }

  protected onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, data: AccordionTitleProps) => {
    const { allowMultipleOpen } = this.props;
    const { activeIndices } = this.state;
    if (data === undefined || data.index === undefined) {
      return;
    }

    const alreadyActive = activeIndices.includes(data.index);
    if (alreadyActive) {
      this.setState({
        activeIndices: activeIndices.filter(index => index !== data.index),
      });
    } else if (allowMultipleOpen) {
      this.setState({
        activeIndices: [...activeIndices, data.index],
      });
    } else {
      this.setState({
        activeIndices: [data.index],
      });
    }
  };

  protected renderSingleConfig = (config: [string, IConfigGroup]) => {
    return (
      <Grid.Row key={`accordion-${config[0]}`} textAlign={'left'}>
        <Grid padded={true} relaxed={true} stretched={true} style={{ marginTop: '7px' }}>
          {...Object.values(config[1])}
        </Grid>
      </Grid.Row>
    );
  };
}
