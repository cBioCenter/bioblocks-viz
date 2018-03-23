import Slider from 'rc-slider';
import * as React from 'react';

import 'rc-slider/assets/index.css';

export type ChellSliderCallback = (value: number) => void;
export interface IChellSliderProps {
  defaultValue: number;
  label: string;
  max: number;
  min: number;
  onAfterChange?: ChellSliderCallback;
  onChange?: ChellSliderCallback;
}

export interface IChellSliderState {
  value: number;
}

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

  private onAfterChange = (cb?: ChellSliderCallback) => (value: number) => {
    if (cb) {
      cb(value);
    }
    this.setState({
      value,
    });
  };

  private onChange = (cb?: ChellSliderCallback) => (value: number) => {
    if (cb) {
      cb(value);
    }
    this.setState({
      value,
    });
  };
}