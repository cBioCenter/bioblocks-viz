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
        {configs.map((config, index) =>
          Object.keys(config).map(configKey => (
            <>
              <Accordion.Title
                active={activeIndex === index}
                index={index}
                key={`${configKey}-title`}
                onClick={this.onClick}
              >
                <Icon name={'dropdown'} />
                {configKey}
              </Accordion.Title>
              <Accordion.Content active={activeIndex === index} key={`${configKey}-content`}>
                <Grid centered={true} style={gridStyle}>
                  {...config[configKey]}
                </Grid>
              </Accordion.Content>
            </>
          )),
        )}
      </Accordion>
    );
  }

  protected onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, data: AccordionTitleProps) => {
    const { activeIndex } = this.state;
    this.setState({
      activeIndex: activeIndex === data.index ? -1 : data.index,
    });
  };
}
