import * as React from 'react';
// tslint:disable-next-line:import-name
import IframeComm from 'react-iframe-comm';
import { Grid, GridRow } from 'semantic-ui-react';

import { VizPanelContainer } from '~chell-viz~/container';
import { VIZ_TYPE } from '~chell-viz~/data';

export class ChellVizApp extends React.Component<any, any> {
  public render() {
    return (
      <div id="ChellVizApp">
        <Grid centered={true} divided={'vertically'}>
          <GridRow>
            <VizPanelContainer
              allowUploads={false}
              dataDirs={['hpc/full'].map(dir => `assets/datasets/${dir}`)}
              initialVisualizations={[VIZ_TYPE.SPRING, VIZ_TYPE['TENSOR-T-SNE']]}
              supportedVisualizations={[VIZ_TYPE.SPRING, VIZ_TYPE['TENSOR-T-SNE']]}
              numPanels={2}
            />
          </GridRow>
          <GridRow centered={true} style={{ padding: '0 50px' }}>
            <IframeComm
              attributes={{ src: `${window.origin}/morpheus.html`, height: '500px', width: '100%' }}
              postMessageData={{}}
            />
          </GridRow>
        </Grid>
      </div>
    );
  }
}
