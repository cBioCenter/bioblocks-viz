import Slider, { SliderProps } from 'rc-slider';
import * as React from 'react';

import 'rc-slider/assets/index.css';

/** Function signature that is invoked on slider events. */
export type ChellSliderCallback =
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
  /** CSS class to identify this slider. */
  className?: string;

  /** Value the slider is set to. */
  value: number;

  // TODO Split up label and value, have both be independently visible or not.
  /** Should we show the label/value for the slider? */
  hideLabelValue?: boolean;

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

  /** Props specific to the underlying rc-slider component. */
  sliderProps?: SliderProps;

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
export default class ChellSlider extends React.Component<IChellSliderProps, IChellSliderState> {
  constructor(props: IChellSliderProps) {
    super(props);
    this.state = {
      value: props.value,
    };
  }

  public componentDidUpdate(prevProps: IChellSliderProps, prevState: IChellSliderState) {
    const { value } = this.props;
    if (value !== this.state.value) {
      this.setState({
        value,
      });
    }
  }

  public render() {
    const {
      className,
      value,
      hideLabelValue,
      max,
      min,
      label,
      onAfterChange,
      onChange,
      sliderProps,
      style,
    } = this.props;
    return (
      <div className={className} style={{ padding: 20 }}>
        {!hideLabelValue && <p>{`${label}: ${this.state.value}`}</p>}
        <Slider
          max={max}
          min={min}
          onAfterChange={this.onAfterChange(onAfterChange)}
          onChange={this.onChange(onChange)}
          style={style}
          value={value}
          {...sliderProps}
        />
      </div>
    );
  }

  /**
   * Updates the state of the slider after user commits to change. If applicable, invokes appropriate callback.
   */
  protected onAfterChange = (cb?: ChellSliderCallback) => (value: number) => {
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
   */
  protected onChange = (cb?: ChellSliderCallback) => (value: number) => {
    if (cb) {
      cb(value);
    }
    this.setState({
      value,
    });
  };
}

export { ChellSlider };
