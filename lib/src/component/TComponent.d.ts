/// <reference types="react" />
import * as React from 'react';
export declare const TComponent: React.ComponentType<
  Partial<{
    data: number[][];
    height: number;
    padding: number;
    pointColor: string;
    width: number;
  }> &
    Required<
      Pick<
        {
          data: number[][];
          height: number;
          padding: number;
          pointColor: string;
          width: number;
        },
        never
      >
    >
>;
