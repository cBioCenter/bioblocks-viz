import * as React from 'react';
import { SECONDARY_STRUCTURE_CODES } from '../data/chell-data';

export interface ISecondaryStructureProps {
  sequence: string[];
}

export default class SecondaryStructure extends React.Component<ISecondaryStructureProps, any> {
  constructor(props: ISecondaryStructureProps) {
    super(props);
  }

  // Points arrow down: transform: 'rotate(90deg)'
  public render() {
    return (
      <div style={{ fontFamily: 'fira code', fontSize: 16, textAlign: 'right' }}>
        {this.props.sequence.map(char => this.deriveSecondaryStructureCode(char))}
      </div>
    );
  }

  protected deriveSecondaryStructureCode(code: string) {
    switch (code) {
      case SECONDARY_STRUCTURE_CODES.ALPHA_HELIX:
        return '~';
      case SECONDARY_STRUCTURE_CODES.BETA_SHEET:
        return '->';
      case SECONDARY_STRUCTURE_CODES.COIL:
        return '-';
      default:
        return code;
    }
  }
}

export { SecondaryStructure };
