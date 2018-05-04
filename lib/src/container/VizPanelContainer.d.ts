/// <reference types="react" />
import { VIZ_TYPE } from 'chell';
import * as React from 'react';
export declare const VizPanelContainer: React.ComponentType<
  Partial<{
    initialVisualizations: VIZ_TYPE[];
    numPanels: 2 | 4 | 3 | 1;
  }> &
    Required<
      Pick<
        {
          dataDirs: string[];
          supportedVisualizations: VIZ_TYPE[];
        } & {
          initialVisualizations: VIZ_TYPE[];
          numPanels: 2 | 4 | 3 | 1;
        },
        'supportedVisualizations' | 'dataDirs'
      >
    >
>;
