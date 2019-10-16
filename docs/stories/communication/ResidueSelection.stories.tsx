import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { ContactMapContainer, NGLContainer } from '~bioblocks-viz~/container';
import { BioblocksPDB, CouplingContainer } from '~bioblocks-viz~/data';

export default {
  component: [ContactMapContainer, NGLContainer],
  title: 'communication/Anatomogram',
};

if (window) {
  window.addEventListener('message', e => {
    console.log('oi');
    console.log(e);
  });
}

export const Foo = () => {
  return (
    <div>
      <iframe
        id="bioblocks-frame-2"
        sandbox={'allow-scripts allow-same-origin'}
        width="525"
        height="530"
        src="bioblocks.html"
        onLoad={() => {
          const iframe = document.getElementById('bioblocks-frame-2');
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
    </div>
  );
};
