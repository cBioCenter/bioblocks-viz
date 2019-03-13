import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { fetchDataset } from '~bioblocks-viz~/action';
import { ComponentCard, PredictedContactMap } from '~bioblocks-viz~/component';
import { BioblocksVisualization } from '~bioblocks-viz~/container';
import { CouplingContainer, IContactMapData, SECONDARY_STRUCTURE_SECTION } from '~bioblocks-viz~/data';
import { fetchContactMapData } from '~bioblocks-viz~/helper';
import { createDataReducer } from '~bioblocks-viz~/reducer';
import { selectCurrentItems, selectCurrentValue } from '~bioblocks-viz~/selector';

export interface IPredictedContactMapContainerProps {
  data: IContactMapData;
  hoveredSecondaryStructures: SECONDARY_STRUCTURE_SECTION[];
  selectedSecondaryStructures: SECONDARY_STRUCTURE_SECTION[];
  dispatchContactMapFetch(dataset: string, fetchFn: () => Promise<IContactMapData>): void;
}

export class PredictedContactMapContainerClass extends BioblocksVisualization<IPredictedContactMapContainerProps> {
  constructor(props: IPredictedContactMapContainerProps) {
    super(props);
  }

  public setupDataServices() {
    const { dispatchContactMapFetch } = this.props;
    createDataReducer<IContactMapData>('contactMap', {
      couplingScores: new CouplingContainer(),
      secondaryStructures: [],
    });

    dispatchContactMapFetch('contactMap', async () => fetchContactMapData('assets/1g68', 'known'));
  }

  public render() {
    return (
      <ComponentCard componentName={'Predicted Contact Map'}>
        <PredictedContactMap {...this.props} />
      </ComponentCard>
    );
  }
}

const mapStateToProps = (state: { [key: string]: any }) => ({
  data: selectCurrentValue(state, 'contactMap', {
    couplingScores: new CouplingContainer(),
    secondaryStructures: [],
  }) as IContactMapData,
  hoveredSecondaryStructures: selectCurrentItems<SECONDARY_STRUCTURE_SECTION>(
    state,
    'secondaryStructure/hovered',
  ).toArray(),
  selectedSecondaryStructures: selectCurrentItems<SECONDARY_STRUCTURE_SECTION>(
    state,
    'secondaryStructure/selected',
  ).toArray(),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      dispatchContactMapFetch: fetchDataset,
    },
    dispatch,
  );

export const PredictedContactMapContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PredictedContactMapContainerClass);
