import * as React from 'react';

export interface ISecondaryStructureProps {
  sequence: string[];
}

export default class SecondaryStructure extends React.Component<ISecondaryStructureProps, any> {
  constructor(props: ISecondaryStructureProps) {
    super(props);
  }

  public render() {
    return <div>{this.props.sequence}</div>;
  }
}

export { SecondaryStructure };
