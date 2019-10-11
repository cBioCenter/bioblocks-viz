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
                  data: {
                    couplingScores: {
                      ...new CouplingContainer([
                        // Agreement
                        { i: 381, A_i: 'Q', j: 391, A_j: 'Y', dist: 3.342438331517875 },
                        { i: 337, A_i: 'R', j: 346, A_j: 'Q', dist: 2.6320275454485698 },
                        { i: 328, A_i: 'P', j: 338, A_j: 'P', dist: 5.037053205992569 },
                        { i: 388, A_i: 'Q', j: 392, A_j: 'D', dist: 2.7139880250288506 },
                        { i: 387, A_i: 'D', j: 390, A_j: 'L', dist: 2.6750674757844877 },
                        // Disagreement
                        { i: 388, A_i: 'Q', j: 695, A_j: 'L', dist: 45.912429569779896 },
                        { i: 375, A_i: 'L', j: 670, A_j: 'T', dist: 64.49344361250995 },
                        { i: 446, A_i: 'A', j: 580, A_j: 'L', dist: 32.842243056770656 },
                        { i: 232, A_i: 'T', j: 448, A_j: 'D', dist: 34.00742236630116 },
                        { i: 374, A_i: 'N', j: 553, A_j: 'D', dist: 62.27235530313592 },
                      ]),
                    },
                    secondaryStructures: [],
                  },
                },
                viz: 'Contact Map',
              },
              '*',
            );
          }
        }}
      />
    </div>
  );
};
