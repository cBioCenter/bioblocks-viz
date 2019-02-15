import * as React from 'react';

export interface IBioblocksTooltipProps {
  style?: React.CSSProperties;
  message: string;
  timeout?: number;
}

const defaultStyle: React.CSSProperties = {
  backgroundColor: 'rgba(0, 244, 0, 0.6)',
  color: 'lightgrey',
  display: 'block',
  fontFamily: 'sans-serif',
  padding: '0.5em',
  pointerEvents: 'none',
  position: 'absolute',
  zIndex: 10,
};

export const initialTooltipState = {
  show: true,
  timer: undefined as undefined | NodeJS.Timer | number,
};

export type BioblocksTooltipState = Readonly<typeof initialTooltipState>;

export class BioblocksTooltip extends React.Component<IBioblocksTooltipProps, BioblocksTooltipState> {
  public readonly state: BioblocksTooltipState = initialTooltipState;

  constructor(props: IBioblocksTooltipProps) {
    super(props);
  }

  public componentDidUpdate(nextProps: IBioblocksTooltipProps) {
    const { timeout = 0 } = nextProps;
    if (!this.state.timer && timeout > 0) {
      const timer = setTimeout(() => {
        this.setState({ show: false });
      }, timeout);
      this.setState({
        timer,
      });
    }
  }

  public componentWillUnmount() {
    const { timer } = this.state;
    if (timer) {
      clearTimeout(timer as number);
    }
  }

  public render() {
    const { message, style = defaultStyle } = this.props;
    const { show } = this.state;

    return (
      show && (
        <div style={style} className="BioblocksTooltip">
          {message}
        </div>
      )
    );
  }
}
