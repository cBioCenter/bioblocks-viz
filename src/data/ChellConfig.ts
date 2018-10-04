import { ButtonProps } from 'semantic-ui-react';

export enum CONFIGURATION_COMPONENT_TYPE {
  BUTTON = 'BUTTON',
  RADIO = 'RADIO',
  SLIDER = 'SLIDER',
}

export interface IBaseChellWidgetConfig {
  id?: string;
  name: string;
  style?: React.CSSProperties;
  onChange?(...args: any): any;
}

export interface IChellWidgetValueConfig {
  values: {
    current: number;
    max: number;
    min: number;
  };
  onChange(...args: any): any;
}

export type ButtonWidgetConfig = IBaseChellWidgetConfig &
  ({
    // tslint:disable-next-line:no-reserved-keywords
    type: CONFIGURATION_COMPONENT_TYPE.BUTTON;
    onClick(event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps): void;
  });

export type RadioWidgetConfig = IBaseChellWidgetConfig &
  ({
    current: string;
    options: string[];
    // tslint:disable-next-line:no-reserved-keywords
    type: CONFIGURATION_COMPONENT_TYPE.RADIO;
  });

export type SliderWidgetConfig = IBaseChellWidgetConfig &
  IChellWidgetValueConfig &
  ({
    // tslint:disable-next-line:no-reserved-keywords
    type: CONFIGURATION_COMPONENT_TYPE.SLIDER;
  });

export type ChellWidgetConfig = ButtonWidgetConfig | RadioWidgetConfig | SliderWidgetConfig;
