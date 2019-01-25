import * as ngl from 'ngl';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { fetchDataset } from '~chell-viz~/action';
import { ChellVisualization } from '~chell-viz~/container';
import { fetchNGLDataFromFile } from '~chell-viz~/helper';
import { createDataReducer } from '~chell-viz~/reducer';
import { selectCurrentItem } from '~chell-viz~/selector/ValueSelectors';

export interface INGLContainerProps {
  nglStructure: ngl.Structure | null;
  dispatchNglFetch(dataset: string, fetchFn: () => Promise<ngl.Structure>): void;
}

export class NGLContainerClass extends ChellVisualization<INGLContainerProps> {
  constructor(props: INGLContainerProps) {
    super(props);
  }

  public setupDataServices() {
    const { dispatchNglFetch } = this.props;
    createDataReducer<ngl.Structure>('ngl');
    dispatchNglFetch('ngl', async () => fetchNGLDataFromFile('assets/5P21/5P21.pdb'));
  }

  public render() {
    return <div />;
  }
}

const mapStateToProps = (state: { [key: string]: any }) => ({
  nglStructure: selectCurrentItem<ngl.Structure>(state, 'ngl'),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      dispatchNglFetch: fetchDataset,
    },
    dispatch,
  );

export const NGLContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NGLContainerClass);
