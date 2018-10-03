import * as React from 'react';

export interface IChellTooltipProps {
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

export type ChellTooltipState = Readonly<typeof initialTooltipState>;

export class ChellTooltip extends React.Component<IChellTooltipProps, ChellTooltipState> {
  public readonly state: ChellTooltipState = initialTooltipState;

  constructor(props: IChellTooltipProps) {
    super(props);
  }

  public componentDidUpdate(nextProps: IChellTooltipProps) {
    const { timeout = 0 } = nextProps;
    if (!this.state.timer && timeout > 0) {
      const timer = setTimeout(() => this.setState({ show: false }), timeout);
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
        <div style={style} className="ChellTooltip">
          {message}
        </div>
      )
    );
  }
}
