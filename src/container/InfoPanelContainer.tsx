import * as React from 'react';
import { Accordion, Label } from 'semantic-ui-react';

import { connectWithBBStore } from '~bioblocks-viz~/component';
import {
  BioblocksPDB,
  CouplingContainer,
  IContactMapData,
  SECONDARY_STRUCTURE,
  SECONDARY_STRUCTURE_CODES,
  SECONDARY_STRUCTURE_SECTION,
} from '~bioblocks-viz~/data';
import { LockedResiduePair } from '~bioblocks-viz~/reducer';
import { getLocked, selectCurrentItems } from '~bioblocks-viz~/selector';

export interface IInfoPanelProps {
  data: IContactMapData;
  height: number;
  lockedResiduePairs: LockedResiduePair;
  selectedSecondaryStructures: SECONDARY_STRUCTURE_SECTION[];
  width: number;
}

export class InfoPanelContainerClass extends React.Component<IInfoPanelProps, any> {
  public static defaultProps = {
    data: {
      couplingScores: new CouplingContainer(),
      pdbData: {},
      secondaryStructures: new Array<SECONDARY_STRUCTURE>(),
    },
    height: 400,
    lockedResiduePairs: {},
    selectedSecondaryStructures: [],
    width: 400,
  };

  constructor(props: IInfoPanelProps) {
    super(props);
  }

  public render() {
    const { data, height, lockedResiduePairs, selectedSecondaryStructures, width } = this.props;
    const { pdbData } = data;
    const unassignedResidues =
      pdbData && pdbData.experimental
        ? this.renderUnassignedResidues(pdbData.experimental)
        : [<Label key={'unassigned-residues-none'} />];

    return (
      <div className="InfoPanel" style={{ height, width }}>
        <Accordion
          exclusive={false}
          panels={[
            pdbData &&
              pdbData.experimental &&
              pdbData.experimental.secondaryStructureSections.map(secondaryStructure => ({
                content: this.renderSecondaryStructures(secondaryStructure),
                key: 'all-secondary-structures',
                title: `All Secondary Structures (${
                  pdbData.experimental ? pdbData.experimental.secondaryStructureSections.length : 0
                }):`,
              })),
            {
              content: unassignedResidues,
              key: 'unassigned-residues',
              title: `Unassigned Residues (${unassignedResidues.length}):`,
            },
            {
              content: this.renderSecondaryStructures(selectedSecondaryStructures),
              key: 'selected-secondary-structures',
              title: `Selected Secondary Structures (${selectedSecondaryStructures.length}):`,
            },
            {
              content: this.renderLockedResiduePairs(lockedResiduePairs),
              key: 'selected-residue-pairs',
              title: `Selected Residue Pairs (${lockedResiduePairs.size}):`,
            },
          ]}
        />
      </div>
    );
  }

  protected renderLockedResiduePairs(lockedResiduePairs: LockedResiduePair) {
    return Object.keys(lockedResiduePairs).length === 0
      ? [<Label key={'locked-residue-pair-none'}>None</Label>]
      : Array.from(Object.values(lockedResiduePairs)).map((pair, index) => (
          <Label key={`locked-residue-pair-${index}`}>{pair.join(', ')}</Label>
        ));
  }

  protected renderSecondaryStructures(selectedSecondaryStructures: SECONDARY_STRUCTURE) {
    return selectedSecondaryStructures.length === 0
      ? [<Label key={'sec-struct-none'}>None</Label>]
      : selectedSecondaryStructures.map((section, index) => (
          <Label key={`sec-struct-${index}`}>{`[${section.start}-${section.end}]: ${section.label} - ${
            SECONDARY_STRUCTURE_CODES[section.label]
          }`}</Label>
        ));
  }

  protected renderUnassignedResidues(pdbData: BioblocksPDB) {
    const result = new Array<JSX.Element>();
    pdbData.eachResidue(residue => {
      if (residue.isProtein()) {
        let isUnassigned = true;
        for (const secondaryStructure of pdbData.secondaryStructureSections) {
          for (const section of secondaryStructure) {
            if (section.contains(residue.resno)) {
              isUnassigned = false;
              break;
            }
          }
        }

        if (isUnassigned) {
          result.push(
            <Label key={`unassigned-residue-${residue.resno}`}>
              {`[${residue.resno}: isCg? ${residue.isCg()}, \
              isDna? ${residue.isDna()}, \
              isHelix? ${residue.isHelix()}, \
              isNucleic? ${residue.isNucleic()}, \
              isProtein? ${residue.isProtein()}, \
              isPolymer? ${residue.isPolymer()}, \
              isSaccharide? ${residue.isSaccharide()}, \
              isSheet? ${residue.isSheet()},\
              isTurn? ${residue.isTurn()}`}
              }
            </Label>,
          );
        }
      }
    });

    return result;
  }
}

const mapStateToProps = (state: { [key: string]: any }) => ({
  lockedResiduePairs: getLocked(state).toJS(),
  selectedSecondaryStructures: selectCurrentItems<SECONDARY_STRUCTURE_SECTION>(
    state,
    'secondaryStructure/selected',
  ).toArray(),
});

export const InfoPanelContainer = connectWithBBStore(mapStateToProps, undefined, InfoPanelContainerClass);
