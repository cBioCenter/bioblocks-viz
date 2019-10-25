import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { ContactMapContainer, NGLContainer } from '~bioblocks-viz~/container';
import { BioblocksPDB, CouplingContainer } from '~bioblocks-viz~/data';
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

export const Foo = () => {
  return (
    <div>
      {getFramedNGL()}
      {getFramedContactMap()}
    </div>
  );
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
              predictedProteins: ['datasets/beta_lactamase/1ZG4.pdb'],
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
    sandbox={'allow-scripts'}
    width="525"
    height="590"
    src="bioblocks.html"
    onLoad={() => {
      const iframe = document.getElementById('bioblocks-frame-contact-map');
      // @ts-ignore
      if (iframe && iframe.contentWindow) {
        // @ts-ignore
        // tslint:disable-next-line: no-unsafe-any
        iframe.contentWindow.postMessage(
          {
            props: {},
            viz: 'Contact Map',
          },
          '*',
        );
      }
    }}
  />
);
