import * as React from 'react';
import { Grid, GridColumn } from 'semantic-ui-react';

import { VizSelectorPanel } from '../component/VizSelectorPanel';

export interface IVizPanelContainerProps {
  /** Number of panels to be controlled by this container. Currently limited to 4. */
  numPanels: 1 | 2 | 3 | 4;
}

export class VizPanelContainer extends React.Component<IVizPanelContainerProps, any> {
  constructor(props: IVizPanelContainerProps) {
    super(props);
  }

  public render() {
    return (
      <Grid className={'VizPanelContainer'} columns={this.props.numPanels} centered={true} relaxed={true}>
        {this.renderPanels(this.props.numPanels).map((panel, index) => <GridColumn key={index}>{panel}</GridColumn>)}
      </Grid>
    );
  }

  protected renderPanels(numPanels: number) {
    const result = [];
    for (let i = 0; i < numPanels; ++i) {
      result.push(<VizSelectorPanel />);
    }
    return result;
  }
}
