import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import {
  CellContextProvider,
  ResidueContextProvider,
  SecondaryStructureContextProvider,
  SpringContextProvider,
} from '~chell-viz~/context';

export interface IChellContextProps extends Partial<RouteComponentProps> {}

/**
 * Shorthand for passing all Chell contexts down.
 *
 * @export
 * @extends {React.Component<any, any>}
 */
export class ChellContextProvider extends React.Component<IChellContextProps, any> {
  constructor(props: IChellContextProps) {
    super(props);
  }

  public render() {
    const params = new URLSearchParams(this.props.location ? this.props.location.search : '');
    // tslint:disable-next-line:no-backbone-get-set-outside-model
    const datasetLocation = params.get('name');

    return (
      <SecondaryStructureContextProvider>
        <SpringContextProvider datasetLocation={datasetLocation ? datasetLocation : ''}>
          <CellContextProvider>
            <ResidueContextProvider>{this.props.children}</ResidueContextProvider>
          </CellContextProvider>
        </SpringContextProvider>
      </SecondaryStructureContextProvider>
    );
  }
}
