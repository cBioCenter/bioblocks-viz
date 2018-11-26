import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Grid } from 'semantic-ui-react';
import { ChellContextProvider, SpringContainer } from '~chell-viz~';

ReactDOM.render(
  <div id="ChellVizApp">
    <ChellContextProvider>
      <div style={{ padding: '20px' }}>
        <Grid centered={true} padded={true} style={{ width: '100vmin', height: '100%' }}>
          <SpringContainer
            isFullPage={true}
            springUrl={`${window.location.origin}/${window.location.pathname.substr(
              0,
              window.location.pathname.lastIndexOf('/'),
            )}/springViewer.html?datasets/hpc/full`}
          />
        </Grid>
      </div>
    </ChellContextProvider>
  </div>,
  document.getElementById('app-root'),
);

if (module.hot) {
  module.hot.accept();
}
