import * as React from 'react';
import { connect } from 'react-redux';
import { StateType } from 'typesafe-actions';

export interface IChellMastermindProps {
  state: StateType<any>;
}

class ChellMastermindClass extends React.Component<IChellMastermindProps, any> {
  constructor(props: IChellMastermindProps) {
    super(props);
  }

  public componentDidUpdate(prevProps: IChellMastermindProps) {
    return;
  }

  public render() {
    return <>{this.props.children}</>;
  }
}

const mapStateToProps = (state: StateType<any>) => ({
  state,
});

export const ChellMastermind = connect(mapStateToProps)(ChellMastermindClass);
