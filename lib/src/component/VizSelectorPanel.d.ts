/// <reference types="react" />
import { CHELL_DATA_TYPE, ICouplingScore, VIZ_TYPE } from 'chell';
import * as React from 'react';
export declare const VizSelectorPanel: React.ComponentType<
  Partial<{
    data: Partial<{
      'Contact Map': CHELL_DATA_TYPE;
      NGL: CHELL_DATA_TYPE;
      Spring: CHELL_DATA_TYPE;
      'T-SNE': CHELL_DATA_TYPE;
    }>;
    height: number;
    initialViz: VIZ_TYPE;
    onDataSelect: (e: any) => void;
    padding: number;
    selectedData: ICouplingScore | undefined;
    supportedVisualizations: VIZ_TYPE[];
    width: number;
  }> &
    Required<
      Pick<
        {
          data: Partial<{
            'Contact Map': CHELL_DATA_TYPE;
            NGL: CHELL_DATA_TYPE;
            Spring: CHELL_DATA_TYPE;
            'T-SNE': CHELL_DATA_TYPE;
          }>;
          height: number;
          initialViz: VIZ_TYPE;
          onDataSelect: (e: any) => void;
          padding: number;
          selectedData: ICouplingScore | undefined;
          supportedVisualizations: VIZ_TYPE[];
          width: number;
        },
        never
      >
    >
>;
