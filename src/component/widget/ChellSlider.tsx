import Slider, { SliderProps } from 'rc-slider';
import * as React from 'react';

// https://github.com/react-component/slider/ requires the css imported like this.
// tslint:disable-next-line:no-submodule-imports
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
export type ChellSliderProps = {
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

  /** Style for the slider. */
  style?: React.CSSProperties;
} & Partial<Omit<SliderProps, 'style'>>; // Ignore the style prop from the React slider so we can better control it.

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
 * @extends {React.Component<ChellSliderProps, IChellSliderState>}
 */
export default class ChellSlider extends React.Component<ChellSliderProps, IChellSliderState> {
  constructor(props: ChellSliderProps) {
    super(props);
    this.state = {
      value: props.value,
    };
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
      style,
      ...remainingProps
    } = this.props;
    return (
      <div className={className} style={{ padding: 25, ...style }}>
        {!hideLabelValue && <p>{`${label}: ${this.state.value}`}</p>}
        <Slider
          max={max}
          min={min}
          onAfterChange={this.onAfterChange(onAfterChange)}
          onChange={this.onChange(onChange)}
          style={style}
          value={value}
          {...remainingProps}
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
