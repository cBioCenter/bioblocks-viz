import * as React from 'react';

const defaultTooltipProps = {
  style: {
    backgroundColor: 'rgba(0, 244, 0, 0.6)',
    color: 'lightgrey',
    display: 'block',
    fontFamily: 'sans-serif',
    padding: '0.5em',
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: 10,
  } as React.CSSProperties,
  timeout: 0,
};

export const defaultTooltipState = {
  show: true,
};

export type ChellTooltipProps = {
  message: string;
} & typeof defaultTooltipProps;

export type ChellTooltipState = {} & typeof defaultTooltipState;

class ChellTooltip extends React.Component<ChellTooltipProps, ChellTooltipState> {
  public static getDerivedStateFromProps(props: ChellTooltipProps) {
    if (props.timeout === 0) {
      return { show: true };
    }
  }

  constructor(props: ChellTooltipProps) {
    super(props);
  }

  public componentDidUpdate(nextProps: ChellTooltipProps) {
    if (nextProps.timeout > 0) {
      setTimeout(() => {
        this.setState({ show: false });
      }, nextProps.timeout);
    }
  }

  public render() {
    const { message, style } = this.props;
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

export default ChellTooltip;

export { ChellTooltip };
