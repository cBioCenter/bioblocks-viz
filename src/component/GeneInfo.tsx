import * as React from 'react';

export interface IGeneInfoProps {
  geneName?: string;
}

export const GeneInfo: React.SFC<IGeneInfoProps> = props => {
  return props.geneName ? <div>You selected {props.geneName}</div> : null;
};
