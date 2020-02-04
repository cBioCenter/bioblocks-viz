import * as React from 'react';

import { ContactMapContainer, NGLContainer } from '~bioblocks-viz~/container';
import { fetchContactMapData } from '~bioblocks-viz~/helper';

export default {
  component: [ContactMapContainer, NGLContainer],
  title: 'communication/Residue Selection',
};

if (window) {
  window.addEventListener('message', e => {
    console.log(e);
  });
}

export const Story = () => {
  return (
    <div>
      {getFramedNGL()}
      {getFramedContactMap()}
    </div>
  );
};

Story.story = {
  name: 'Beta Lactamase 1ZG4',
};

const getFramedNGL = () => (
  <iframe
    id="bioblocks-frame-ngl"
    sandbox={'allow-scripts allow-same-origin'}
    width="525"
    height="590"
    src="bioblocks.html"
    onLoad={() => {
      const iframe = document.getElementById('bioblocks-frame-ngl');
      // @ts-ignore
      if (iframe && iframe.contentWindow) {
        // @ts-ignore
        // tslint:disable-next-line: no-unsafe-any
        iframe.contentWindow.postMessage(
          {
            props: {
              predictedProteins: ['datasets/beta_lactamase/1zg4.pdb'],
            },
            viz: 'NGL',
          },
          '*',
        );
      }
    }}
  />
);

const getFramedContactMap = () => (
  <iframe
    id="bioblocks-frame-contact-map"
    sandbox={'allow-scripts allow-same-origin'}
    width="525"
    height="590"
    src="bioblocks.html"
    onLoad={async () => {
      const data = await fetchContactMapData('datasets/beta_lactamase');
      const iframe = document.getElementById('bioblocks-frame-contact-map');
      // @ts-ignore
      if (iframe && iframe.contentWindow) {
        // @ts-ignore
        // tslint:disable-next-line: no-unsafe-any
        iframe.contentWindow.postMessage(
          {
            props: {
              data: { couplingScores: data.couplingScores },
            },
            viz: 'Contact Map',
          },
          '*',
        );
      }
    }}
  />
);
