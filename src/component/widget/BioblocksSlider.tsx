// tslint:disable-next-line:import-name
import Slider, { SliderProps } from 'rc-slider';
import * as React from 'react';

// https://github.com/react-component/slider/ requires the css imported like this.
// tslint:disable-next-line:no-submodule-imports no-import-side-effect
import 'rc-slider/assets/index.css';
import { Button, Grid } from 'semantic-ui-react';

/** Function signature that is invoked on slider events. */
export type BioblocksSliderCallback =
  /**
   * @param value New value the slider is currently on top of.
   */
  (value: number) => void;

/**
 * Properties that BioblocksSlider accepts.
 *
 * @export
 */
export type BioblocksSliderProps = {
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
  onAfterChange?: BioblocksSliderCallback;

  /** Invoked when the value is in the middle of changing but user has not committed to the change. */
  onChange?: BioblocksSliderCallback;

  /** Style for the slider. */
  style?: React.CSSProperties;
} & Partial<Omit<SliderProps, 'style'>>; // Ignore the style prop from the React slider so we can better control it.

/**
 * State of the Bioblocks Slider.
 *
 * @export
 */
export interface IBioblocksSliderState {
  /** Initial value the slider should be reset to. */
  defaultValue: number;

  /** Value the slider is currently set to. */
  value: number;
}

/**
 * Represents a simple 2d slider, allowing a value to be selected between a minimum and maximum.
 *
 * @export
 * @extends {React.Component<BioblocksSliderProps, IBioblocksSliderState>}
 */
export class BioblocksSlider extends React.Component<BioblocksSliderProps, IBioblocksSliderState> {
  constructor(props: BioblocksSliderProps) {
    super(props);
    this.state = {
      defaultValue: props.defaultValue ? props.defaultValue : props.value,
      value: props.value,
    };
  }

  public componentDidUpdate(prevProps: BioblocksSliderProps) {
    const { defaultValue, value } = this.props;
    if (value && value !== prevProps.value) {
      this.setState({
        value,
      });
    }

    const candidateDefaultValue = defaultValue ? defaultValue : value;
    if (this.state.defaultValue === -1 && candidateDefaultValue !== this.state.defaultValue) {
      this.setState({
        defaultValue: candidateDefaultValue,
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
      style,
      ...remainingProps
    } = this.props;

    return (
      <Grid columns={'equal'} style={style} textAlign={'left'}>
        <Grid.Column className={className}>
          {!hideLabelValue && <p>{`${label}: ${this.state.value}`}</p>}
          <Slider
            max={max}
            min={min}
            onAfterChange={this.onAfterChange(onAfterChange)}
            onChange={this.onChange(onChange)}
            value={value}
            {...remainingProps}
          />
        </Grid.Column>
        <Grid.Column verticalAlign={'middle'} width={2}>
          <Button icon={'undo'} onClick={this.onReset} size={'small'} />
        </Grid.Column>
      </Grid>
    );
  }

  /**
   * Updates the state of the slider after user commits to change. If applicable, invokes appropriate callback.
   */
  protected onAfterChange = (cb?: BioblocksSliderCallback) => (value: number) => {
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
  protected onChange = (cb?: BioblocksSliderCallback) => (value: number) => {
    if (cb) {
      cb(value);
    }
    this.setState({
      value,
    });
  };

  protected onReset = () => {
    this.onChange(this.props.onChange)(this.state.defaultValue);
    // this.onAfterChange(this.props.onAfterChange)(this.state.defaultValue);
  };
}
