// ~bb-viz~
// Bioblocks Range Slider
// Represents a simple 2d slider, allowing a range to be selected within a minimum and maximum.
// ~bb-viz~

// tslint:disable-next-line:import-name
import { Range, RangeProps } from 'rc-slider';
import * as React from 'react';

// https://github.com/react-component/slider/ requires the css imported like this.
// tslint:disable-next-line:no-submodule-imports no-import-side-effect
import 'rc-slider/assets/index.css';
import { Button, Grid } from 'semantic-ui-react';

/** Function signature that is invoked on slider events. */
export type BioblocksRangeSliderCallback =
  /**
   * @param range New value the slider is currently on top of.
   */
  (range: number[]) => void;

/**
 * Properties that BioblocksSlider accepts.
 *
 * @export
 */
export type BioblocksRangeSliderProps = {
  defaultValue?: number[];

  /** Range the slider is set to. */
  value: number[];

  // TODO Split up label and value, have both be independently visible or not.
  /** Should we show the label/value for the slider? */
  hideLabelValue?: boolean;

  /** Initial value the slider is set to. */
  label: string;

  /** Maximum range for slider. */
  max: number;

  /** Minimum range for slider. */
  min: number;

  /** Invoked when the value has finished changing the slider value - usually by releasing the mouse. */
  onAfterChange?: BioblocksRangeSliderCallback;

  /** Invoked when the value is in the middle of changing but user has not committed to the change. */
  onChange?: BioblocksRangeSliderCallback;

  /** Style for the slider. */
  style?: React.CSSProperties;
} & Partial<Omit<RangeProps, 'style'>>; // Ignore the style prop from the React slider so we can better control it.

/**
 * State of the Bioblocks Slider.
 *
 * @export
 */
export interface IBioblocksRangeSliderState {
  /** Initial range the slider should be reset to. */
  defaultValue: number[];

  /** Range the slider is currently set to. */
  range: number[];
}

/**
 * Represents a simple 2d slider, allowing a range to be selected within a minimum and maximum.
 *
 * @export
 * @extends {React.Component<BioblocksRangeSliderProps, IBioblocksRangeSliderState>}
 */
export class BioblocksRangeSlider extends React.Component<BioblocksRangeSliderProps, IBioblocksRangeSliderState> {
  constructor(props: BioblocksRangeSliderProps) {
    super(props);
    this.state = {
      defaultValue: props.defaultValue ? props.defaultValue : props.value,
      range: props.value,
    };
  }

  public componentDidUpdate(prevProps: BioblocksRangeSliderProps) {
    const { defaultValue: defaultRange, value: range } = this.props;
    if (range && range !== prevProps.value) {
      this.setState({
        range,
      });
    }

    const candidateDefaultRange = defaultRange ? defaultRange : range;
    if (candidateDefaultRange !== this.state.defaultValue) {
      this.setState({
        defaultValue: candidateDefaultRange,
      });
    }
  }

  public render() {
    const { value, hideLabelValue, max, min, label, onAfterChange, onChange, style, ...remainingProps } = this.props;
    const { range } = this.state;

    return (
      <div style={style}>
        <Grid.Column style={{ float: 'left', height: '100%', width: '75%' }}>
          {!hideLabelValue && <p>{`${label}: [${range.join(' - ')}]`}</p>}
          <Range
            allowCross={false}
            pushable={false}
            max={max}
            min={min}
            onAfterChange={this.onAfterChange(onAfterChange)}
            onChange={this.onChange(onChange)}
            value={value}
            {...remainingProps}
          />
        </Grid.Column>
        <Grid.Column style={{ float: 'right', padding: '5% 0', width: '20%' }} verticalAlign={'middle'}>
          <Button icon={'undo'} onClick={this.onReset} size={'small'} />
        </Grid.Column>
      </div>
    );
  }

  /**
   * Updates the state of the slider after user commits to change. If applicable, invokes appropriate callback.
   */
  protected onAfterChange = (cb?: BioblocksRangeSliderCallback) => (range: number[]) => {
    if (cb) {
      cb(range);
    }
    this.setState({
      range,
    });
  };

  /**
   * Updates the state of the slider as the user moves the slider around but before selection is committed.
   * If applicable, invokes appropriate callback as well.
   */
  protected onChange = (cb?: BioblocksRangeSliderCallback) => (range: number[]) => {
    if (cb) {
      cb(range);
    }
    this.setState({
      range,
    });
  };

  protected onReset = () => {
    this.onChange(this.props.onChange)(this.state.defaultValue);
    // this.onAfterChange(this.props.onAfterChange)(this.state.defaultValue);
  };
}
