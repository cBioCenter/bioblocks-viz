import * as React from 'react';
import { Grid, GridRow } from 'semantic-ui-react';

import ContactMap from './component/ContactMap';
import VizPanelContainer from './container/VizPanelContainer';
import { VIZ_TYPE } from './data/chell-data';

export class ChellVizApp extends React.Component<any, any> {
  public render() {
    return (
      <div id="ChellVizApp">
        <Grid centered={true} divided={'vertically'}>
          <GridRow>
            <ContactMap
              data={{
                contactMonomer: [{ i: 0, j: 1, dist: 10 }, { i: 1, j: 0, dist: 10 }],
                couplingScore: [
                  {
                    i: 0,
                    // tslint:disable-next-line:object-literal-sort-keys
                    A_i: 'I',
                    j: 1,
                    A_j: 'J',
                    fn: 1,
                    cn: 1,
                    segment_i: 'K',
                    segment_j: 'L',
                    probability: 1,
                    dist_intra: 1,
                    dist_multimer: 1,
                    dist: 10,
                    precision: 10,
                  },
                ],
              }}
              enableSliders={false}
            />
          </GridRow>
          <GridRow>
            <VizPanelContainer
              dataDirs={['1', '2', '3'].map(dir => `assets/contact_map/example${dir}`)}
              supportedVisualizations={[VIZ_TYPE.CONTACT_MAP, VIZ_TYPE.NGL]}
              initialVisualizations={[VIZ_TYPE.CONTACT_MAP, VIZ_TYPE.NGL]}
              numPanels={2}
            />
          </GridRow>
          <GridRow>
            <VizPanelContainer
              dataDirs={['centroids', 'centroids_subset', 'ngl', 'spring2/full'].map(dir => `assets/${dir}`)}
              initialVisualizations={[VIZ_TYPE['T-SNE'], VIZ_TYPE.SPRING]}
              supportedVisualizations={[VIZ_TYPE['T-SNE'], VIZ_TYPE.SPRING]}
              numPanels={2}
            />
          </GridRow>
        </Grid>
      </div>
    );
  }
}
