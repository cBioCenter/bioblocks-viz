import * as React from 'react';

import { fetchSpringCoordinateData } from '~chell-viz~/helper';

export interface ISpringContext {
  coordinates: number[][];
}

export const initialSpringContext: ISpringContext = {
  coordinates: [],
};

export type SpringContextState = Readonly<typeof initialSpringContext>;

export const SpringContext = React.createContext(initialSpringContext);

export class SpringContextProvider extends React.Component<any, SpringContextState> {
  public constructor(props: any) {
    super(props);
    this.state = initialSpringContext;
  }

  public async componentDidMount() {
    const coords = await fetchSpringCoordinateData('assets/datasets/hpc/full/coordinates.txt');
    this.setState({
      coordinates: coords,
    });
  }

  public render() {
    return <SpringContext.Provider value={this.state}>{this.props.children}</SpringContext.Provider>;
  }
}
