import { Set } from 'immutable';
import * as NGL from 'ngl';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { fetchDataset } from '~chell-viz~/action';
import { ComponentCard, NGLComponent } from '~chell-viz~/component';
import { ChellVisualization } from '~chell-viz~/container';
import { ChellPDB, CONTACT_DISTANCE_PROXIMITY, RESIDUE_TYPE, SECONDARY_STRUCTURE } from '~chell-viz~/data';
import {
  createBallStickRepresentation,
  createDistanceRepresentation,
  createSecStructRepresentation,
  fetchNGLDataFromFile,
} from '~chell-viz~/helper';
import { createDataReducer } from '~chell-viz~/reducer';
import { selectCurrentItems } from '~chell-viz~/selector';
import { selectCurrentItem } from '~chell-viz~/selector/ValueSelectors';

export interface INGLContainerProps {
  measuredProximity: CONTACT_DISTANCE_PROXIMITY;
  nglStructure: NGL.Structure | null;
  candidateResidues: Set<RESIDUE_TYPE>;
  hoveredResidues: Set<RESIDUE_TYPE>;
  hoveredSecondaryStructures: SECONDARY_STRUCTURE | null;
  lockedResiduePairs: Map<string, RESIDUE_TYPE> | null;
  selectedResidues: Set<RESIDUE_TYPE>;
  selectedSecondaryStructures: SECONDARY_STRUCTURE | null;
  dispatchNglFetch(dataset: string, fetchFn: () => Promise<NGL.Structure>): void;
}

export class NGLContainerClass extends ChellVisualization<INGLContainerProps> {
  public static defaultProps = {
    measuredProximity: CONTACT_DISTANCE_PROXIMITY.C_ALPHA,
  };

  constructor(props: INGLContainerProps) {
    super(props);
  }

  public setupDataServices() {
    const { dispatchNglFetch } = this.props;
    createDataReducer<NGL.Structure>('ngl');
    dispatchNglFetch('ngl', async () => fetchNGLDataFromFile('assets/5P21/5P21.pdb'));
  }

  public render() {
    const { nglStructure } = this.props;

    return (
      <ComponentCard componentName={'NGL Viewer'}>
        <NGLComponent
          data={nglStructure ? nglStructure : undefined}
          isDataLoading={nglStructure === null}
          height={'90%'}
        />
      </ComponentCard>
    );
  }

  protected deriveActiveRepresentations(structureComponent: NGL.StructureComponent, pdbData?: ChellPDB) {
    const {
      candidateResidues,
      hoveredResidues,
      hoveredSecondaryStructures,
      lockedResiduePairs,
      selectedSecondaryStructures,
    } = this.props;

    return [
      ...this.highlightCandidateResidues(
        structureComponent,
        candidateResidues
          .merge(hoveredResidues)
          .toArray()
          .filter((value, index, array) => array.indexOf(value) === index)
          .sort(),
        pdbData,
      ),
      ...this.highlightLockedDistancePairs(
        structureComponent,
        lockedResiduePairs ? lockedResiduePairs : new Map(),
        pdbData,
      ),
      ...this.highlightSecondaryStructures(structureComponent, [
        ...hoveredSecondaryStructures,
        ...selectedSecondaryStructures,
      ]),
    ];
  }

  protected highlightCandidateResidues(
    structureComponent: NGL.StructureComponent,
    residues: RESIDUE_TYPE[],
    pdbData?: ChellPDB,
  ) {
    const reps = new Array<NGL.RepresentationElement>();

    if (residues.length >= 1) {
      reps.push(createBallStickRepresentation(structureComponent, residues));
      if (residues.length >= 2 && pdbData) {
        reps.push(this.getDistanceRepForResidues(structureComponent, residues, pdbData));
      }
    }

    return reps;
  }

  protected highlightLockedDistancePairs(
    structureComponent: NGL.StructureComponent,
    lockedResidues: Map<string, RESIDUE_TYPE[]>,
    pdbData?: ChellPDB,
  ) {
    const reps = new Array<NGL.RepresentationElement>();

    lockedResidues.forEach(residues => {
      reps.push(createBallStickRepresentation(structureComponent, residues));

      if (residues.length >= 2 && pdbData) {
        reps.push(this.getDistanceRepForResidues(structureComponent, residues, pdbData));
      }
    });

    return reps;
  }

  protected highlightSecondaryStructures(
    structureComponent: NGL.StructureComponent,
    secondaryStructures: SECONDARY_STRUCTURE,
  ) {
    const reps = new Array<NGL.RepresentationElement>();

    for (const structure of secondaryStructures) {
      reps.push(createSecStructRepresentation(structureComponent, structure));
    }

    return reps;
  }

  protected getDistanceRepForResidues(
    structureComponent: NGL.StructureComponent,
    residues: RESIDUE_TYPE[],
    pdbData: ChellPDB,
  ) {
    const { measuredProximity } = this.props;

    if (measuredProximity === CONTACT_DISTANCE_PROXIMITY.C_ALPHA) {
      return createDistanceRepresentation(structureComponent, `${residues.join('.CA, ')}.CA`);
    } else {
      const { atomIndexI, atomIndexJ } = pdbData.getMinDistBetweenResidues(residues[0], residues[1]);

      return createDistanceRepresentation(structureComponent, [atomIndexI, atomIndexJ]);
    }
  }
}

const mapStateToProps = (state: { [key: string]: any }) => ({
  candidateResidues: selectCurrentItems<RESIDUE_TYPE>(state, 'residues/candidate'),
  hoveredResidues: selectCurrentItems<RESIDUE_TYPE>(state, 'residues/hovered'),
  hoveredSecondaryStructures: selectCurrentItem<SECONDARY_STRUCTURE>(state, 'secStruct/hovered'),
  lockedResiduePairs: selectCurrentItem<Map<string, RESIDUE_TYPE>>(state, 'residues/locked'),
  nglStructure: selectCurrentItem<NGL.Structure>(state, 'ngl'),
  selectedResidues: selectCurrentItems<RESIDUE_TYPE>(state, 'residues/selected'),
  selectedSecondaryStructures: selectCurrentItem<SECONDARY_STRUCTURE>(state, 'secStruct/selected'),
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
