import { Marks } from 'rc-slider';
import { ButtonProps, DropdownProps, SemanticICONS } from 'semantic-ui-react';

export enum CONFIGURATION_COMPONENT_TYPE {
  BUTTON = 'BUTTON',
  BUTTON_GROUP = 'BUTTON_GROUP',
  DROP_DOWN = 'DROP_DOWN',
  LABEL = 'LABEL',
  CHECKBOX = 'CHECKBOX',
  RADIO = 'RADIO',
  RANGE_SLIDER = 'RANGE_SLIDER',
  SLIDER = 'SLIDER',
}

export interface IBaseBioblocksWidgetConfig {
  icon?: SemanticICONS;
  id?: string;
  name: string;
  style?: React.CSSProperties;
  onChange?(...args: any): any;
}

export interface IBioblocksWidgetRangeConfig {
  range: {
    current: number[];
    defaultRange: number[];
    max: number;
    min: number;
  };
  onChange?(...args: any): any;
  onAfterChange?(...args: any): any;
}

export interface IBioblocksWidgetValueConfig {
  values: {
    current: number;
    defaultValue: number;
    max: number;
    min: number;
  };
  step?: number | null;
  onChange?(...args: any): any;
  onAfterChange?(...args: any): any;
}

export type ButtonWidgetConfig = IBaseBioblocksWidgetConfig &
  ({
    // tslint:disable-next-line:no-reserved-keywords
    type: CONFIGURATION_COMPONENT_TYPE.BUTTON;
    onClick(event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps): void;
  });

export type ButtonGroupWidgetConfig = IBaseBioblocksWidgetConfig &
  ({
    options: JSX.Element[];
    // tslint:disable-next-line:no-reserved-keywords
    type: CONFIGURATION_COMPONENT_TYPE.BUTTON_GROUP;
  });

export type CheckboxWidgetConfig = IBaseBioblocksWidgetConfig &
  ({
    checked: boolean;
    // tslint:disable-next-line:no-reserved-keywords
    type: CONFIGURATION_COMPONENT_TYPE.CHECKBOX;
  });

export type DropDownWidgetConfig = IBaseBioblocksWidgetConfig &
  ({
    current: string;
    defaultOption?: string;
    options: Array<{ text: string; value: string }>;
    // tslint:disable-next-line:no-reserved-keywords
    type: CONFIGURATION_COMPONENT_TYPE.DROP_DOWN;
    onChange(event: React.SyntheticEvent<HTMLElement>, data: DropdownProps): void;
  });

export type LabelWidgetConfig = IBaseBioblocksWidgetConfig &
  ({
    // tslint:disable-next-line:no-reserved-keywords
    type: CONFIGURATION_COMPONENT_TYPE.LABEL;
  });

export type RadioWidgetConfig = IBaseBioblocksWidgetConfig &
  ({
    current: string;
    defaultOption?: string;
    options: string[];
    // tslint:disable-next-line:no-reserved-keywords
    type: CONFIGURATION_COMPONENT_TYPE.RADIO;
  });

export type RangeSliderWidgetConfig = IBaseBioblocksWidgetConfig &
  IBioblocksWidgetRangeConfig &
  ({
    // tslint:disable-next-line:no-reserved-keywords
    type: CONFIGURATION_COMPONENT_TYPE.RANGE_SLIDER;
  });

export type SliderWidgetConfig = IBaseBioblocksWidgetConfig &
  IBioblocksWidgetValueConfig &
  ({
    marks?: Marks;
    // tslint:disable-next-line:no-reserved-keywords
    type: CONFIGURATION_COMPONENT_TYPE.SLIDER;
  });

export type BioblocksWidgetConfig =
  | ButtonGroupWidgetConfig
  | ButtonWidgetConfig
  | CheckboxWidgetConfig
  | DropDownWidgetConfig
  | LabelWidgetConfig
  | RadioWidgetConfig
  | RangeSliderWidgetConfig
  | SliderWidgetConfig;

// This is to allow components to use a direct height/width prop and not get the two mixed up.
export type BIOBLOCKS_CSS_STYLE = Omit<React.CSSProperties, 'height' | 'width'>;
