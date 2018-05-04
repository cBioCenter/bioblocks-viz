/// <reference types="react" />
import 'rc-slider/assets/index.css';
import * as React from 'react';
/** Function signature that is invoked on slider events. */
export declare type ChellSliderCallback =
  /**
   * @param value New value the slider is currently on top of.
   */
  (value: number) => void;
/**
 * Properties that ChellSlider accepts.
 *
 * @export
 */
export interface IChellSliderProps {
  /** Initial value the slider is set to. */
  defaultValue: number;
  /** Initial value the slider is set to. */
  label: string;
  /** Maximum value for slider. */
  max: number;
  /** Minimum value for slider. */
  min: number;
  /** Invoked when the value has finished changing the slider value - usually by releasing the mouse. */
  onAfterChange?: ChellSliderCallback;
  /** Invoked when the value is in the middle of changing but user has not committed to the change. */
  onChange?: ChellSliderCallback;
  /** Style for the Slider. */
  style?: React.CSSProperties[] | React.CSSProperties;
}
/**
 * State of the Chell Slider.
 *
 * @export
 */
export interface IChellSliderState {
  /** Value the slider is currently set to. */
  value: number;
}
/**
 * Represents a simple 2d slider, allowing a value to be selected between a minimum and maximum.
 *
 * @export
 * @extends {React.Component<IChellSliderProps, IChellSliderState>}
 */
export declare class ChellSlider extends React.Component<IChellSliderProps, IChellSliderState> {
  constructor(props: IChellSliderProps);
  public render(): JSX.Element;
  /**
   * Updates the state of the slider after user commits to change. If applicable, invokes appropriate callback.
   */
  protected onAfterChange: (cb?: ChellSliderCallback | undefined) => (value: number) => void;
  /**
   * Updates the state of the slider as the user moves the slider around but before selection is committed.
   * If applicable, invokes appropriate callback as well.
   */
  protected onChange: (cb?: ChellSliderCallback | undefined) => (value: number) => void;
}
