import * as React from 'react';
import { Accordion, AccordionTitleProps, Grid, Icon } from 'semantic-ui-react';

import { BIOBLOCKS_CSS_STYLE } from '~bioblocks-viz~/data';

// import { BioblocksWidgetConfig } from '~bioblocks-viz~/data';

export interface IConfigGroup {
  [key: string]: JSX.Element[];
}

export interface IConfigAccordionProps {
  configs: IConfigGroup[];
  gridStyle: BIOBLOCKS_CSS_STYLE;
  title: string;
}

export interface IConfigAccordionState {
  activeIndex: string | number | undefined;
}

export class ConfigAccordion extends React.Component<IConfigAccordionProps, IConfigAccordionState> {
  public static defaultProps = {
    gridStyle: {},
  };

  constructor(props: IConfigAccordionProps) {
    super(props);
    this.state = {
      activeIndex: -1,
    };
  }

  public render() {
    const { configs, gridStyle } = this.props;
    const { activeIndex } = this.state;

    return (
      <Accordion>
        <Grid padded={true} stretched={true} style={gridStyle}>
          {configs.map((config, index) =>
            Object.keys(config).length >= 2
              ? Object.keys(config).map(configKey => (
                  <Grid.Row key={`accordion-${configKey}`} textAlign={'left'}>
                    <Accordion.Title
                      active={activeIndex === index}
                      index={index}
                      key={`${configKey}-title`}
                      onClick={this.onClick}
                      style={{ textAlign: 'left' }}
                    >
                      <Icon name={'dropdown'} />
                      {configKey}
                    </Accordion.Title>
                    <Accordion.Content
                      active={activeIndex === index}
                      key={`${configKey}-content`}
                      style={{ width: '100%' }}
                    >
                      <Grid padded={true} relaxed={true} stretched={true} style={{ marginTop: '7px' }}>
                        {...config[configKey]}
                      </Grid>
                    </Accordion.Content>
                  </Grid.Row>
                ))
              : this.renderSingleConfig(Object.keys(config)[0], Object.values(config)[0]),
          )}
        </Grid>
      </Accordion>
    );
  }

  protected onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, data: AccordionTitleProps) => {
    const { activeIndex } = this.state;
    this.setState({
      activeIndex: activeIndex === data.index ? -1 : data.index,
    });
  };

  protected renderSingleConfig = (key: string, elements: JSX.Element[]) => {
    return (
      <Grid.Row key={`accordion-${key}`} textAlign={'left'}>
        <Grid padded={true} relaxed={true} stretched={true} style={{ marginTop: '7px' }}>
          {...elements}
        </Grid>
      </Grid.Row>
    );
  };
}
