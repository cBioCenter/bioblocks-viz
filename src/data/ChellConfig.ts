import { ButtonProps } from 'semantic-ui-react';

export enum CONFIGURATION_COMPONENT_TYPE {
  BUTTON = 'BUTTON',
  RADIO = 'RADIO',
  SLIDER = 'SLIDER',
}

export interface IBaseChellWidgetConfig {
  id?: string;
  name: string;
  onChange?: (...args: any) => any;
  style?: React.CSSProperties;
}

export interface IChellWidgetValueConfig {
  onChange: (...args: any) => any;
  values: {
    current: number;
    max: number;
    min: number;
  };
}

export type ButtonWidgetConfig = IBaseChellWidgetConfig &
  ({
    onClick: (event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps) => void;
    type: CONFIGURATION_COMPONENT_TYPE.BUTTON;
  });

export type RadioWidgetConfig = IBaseChellWidgetConfig &
  ({
    current: string;
    options: string[];
    type: CONFIGURATION_COMPONENT_TYPE.RADIO;
  });

export type SliderWidgetConfig = IBaseChellWidgetConfig &
  IChellWidgetValueConfig &
  ({
    type: CONFIGURATION_COMPONENT_TYPE.SLIDER;
  });

export type ChellWidgetConfig = ButtonWidgetConfig | RadioWidgetConfig | SliderWidgetConfig;
