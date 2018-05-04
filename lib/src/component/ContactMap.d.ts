/// <reference types="react" />
import { IContactMapData, ICouplingScore } from 'chell';
import * as React from 'react';
export declare type CONTACT_MAP_CB_RESULT_TYPE = ICouplingScore;
export declare type ContactMapCallback = (coupling: CONTACT_MAP_CB_RESULT_TYPE) => void;
export declare const ContactMap: React.ComponentType<
  Partial<{
    contactColor: string;
    couplingColor: string;
    data: IContactMapData;
    enableSliders: boolean;
    height: number;
    highlightColor: string;
    onClick: ContactMapCallback | undefined;
    onMouseEnter: ContactMapCallback | undefined;
    padding: number;
    selectedData: number | undefined;
    width: number;
  }> &
    Required<
      Pick<
        {
          contactColor: string;
          couplingColor: string;
          data: IContactMapData;
          enableSliders: boolean;
          height: number;
          highlightColor: string;
          onClick: ContactMapCallback | undefined;
          onMouseEnter: ContactMapCallback | undefined;
          padding: number;
          selectedData: number | undefined;
          width: number;
        },
        never
      >
    >
>;
