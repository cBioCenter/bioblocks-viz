import * as React from 'react';

import { select } from '@storybook/addon-knobs';
import { AnatomogramContainer, AnatomogramContainerClass } from '~bioblocks-viz~/container';

export default {
  component: AnatomogramContainerClass,
  title: 'visualization/Anatomogram',
};

export const WithReact = () => (
  <AnatomogramContainer species={select('species', ['homo_sapiens', 'mus_musculus'], 'homo_sapiens')} />
);

export const WithIFrame = () => (
  <div>
    <iframe
      id="bioblocks-frame"
      sandbox={'allow-scripts allow-same-origin'}
      width="525"
      height="530"
      src="bioblocks.html"
      onLoad={() => {
        const iframe = document.getElementById('bioblocks-frame');
        // @ts-ignore
        if (iframe && iframe.contentWindow) {
          // @ts-ignore
          // tslint:disable-next-line: no-unsafe-any
          iframe.contentWindow.postMessage(
            {
              props: {
                species: 'mus_musculus',
              },
              viz: 'Anatomogram',
            },
            '*',
          );
        }
      }}
    />
  </div>
);
