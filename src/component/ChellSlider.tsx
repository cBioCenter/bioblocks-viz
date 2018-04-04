import Slider from 'rc-slider';
import * as React from 'react';

import 'rc-slider/assets/index.css';

/** Function signature that is invoked on slider events. */
export type ChellSliderCallback =
  /**
   * @param {number} value New value the slider is currently on top of.
   */
  (value: number) => void;

/**
 * Properties that ChellSlider accepts.
 *
 * @export
 * @interface IChellSliderProps
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
}

/**
 * State of the Chell Slider.
 *
 * @export
 * @interface IChellSliderState
 */
export interface IChellSliderState {
  /** Value the slider is currently set to. */
  value: number;
}

/**
 * Represents a simple 2d slider, allowing a value to be selected between a minimum and maximum.
 *
 * @export
 * @class ChellSlider
 * @extends {React.Component<IChellSliderProps, IChellSliderState>}
 */
export class ChellSlider extends React.Component<IChellSliderProps, IChellSliderState> {
  constructor(props: IChellSliderProps) {
    super(props);
    this.state = {
      value: props.defaultValue,
    };
  }

  public render() {
    const { defaultValue, max, min, label, onAfterChange, onChange } = this.props;
    return (
      <div>
        <p>{`${label}: ${this.state.value}`}</p>
        <Slider
          defaultValue={defaultValue}
          max={max}
          min={min}
          onAfterChange={this.onAfterChange(onAfterChange)}
          onChange={this.onChange(onChange)}
        />
      </div>
    );
  }

  /**
   * Updates the state of the slider after user commits to change. If applicable, invokes appropriate callback.
   *
   * @private
   * @memberof ChellSlider
   */
  private onAfterChange = (cb?: ChellSliderCallback) => (value: number) => {
    if (cb) {
      cb(value);
    }
    this.setState({
      value,
    });
  };

  /**
   * Updates the state of the slider as the user moves the slider around but before selection is committed.
   * If applicable, invokes appropriate callback as well.
   *
   * @private
   * @memberof ChellSlider
   */
  private onChange = (cb?: ChellSliderCallback) => (value: number) => {
    if (cb) {
      cb(value);
    }
    this.setState({
      value,
    });
  };
}
