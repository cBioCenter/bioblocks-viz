import * as React from 'react';
import { Accordion, Label } from 'semantic-ui-react';

import ResidueContextHandler, {
  initialResidueContext,
  IResidueContext,
  ResidueSelection,
} from '../context/ResidueContext';
import SecondaryStructureContext, {
  initialSecondaryStructureContext,
  ISecondaryStructureContext,
} from '../context/SecondaryStructureContext';
import { IContactMapData, SECONDARY_STRUCTURE, SECONDARY_STRUCTURE_CODES } from '../data/chell-data';
import { ChellPDB } from '../data/ChellPDB';
import { CouplingContainer } from '../data/CouplingContainer';

export interface IInfoPanelProps {
  data: IContactMapData;
  height: number;
  width: 400;
  residueContext: IResidueContext;
  secondaryStructureContext: ISecondaryStructureContext;
}

export class InfoPanelClass extends React.Component<IInfoPanelProps, any> {
  public static defaultProps = {
    data: {
      couplingScores: new CouplingContainer(),
      secondaryStructures: new Array<SECONDARY_STRUCTURE>(),
    },
    height: 400,
    residueContext: { ...initialResidueContext },
    secondaryStructureContext: { ...initialSecondaryStructureContext },
    width: 400,
  };

  constructor(props: IInfoPanelProps) {
    super(props);
  }

  public render() {
    const { data, height, residueContext, width, secondaryStructureContext } = this.props;
    const unassignedResidues = data.pdbData
      ? this.renderUnassignedResidues(data.pdbData)
      : [<Label key={'unassigned-residues-none'} />];
    return (
      <div className="InfoPanel" style={{ height, width }}>
        <Accordion
          exclusive={false}
          panels={[
            data.pdbData &&
              data.pdbData.secondaryStructureSections.map(secondaryStructure => ({
                content: this.renderSecondaryStructures(secondaryStructure),
                key: 'all-secondary-structures',
                title: `All Secondary Structures (${
                  data.pdbData ? data.pdbData.secondaryStructureSections.length : 0
                }):`,
              })),
            {
              content: unassignedResidues,
              key: 'unassigned-residues',
              title: `Unassigned Residues (${unassignedResidues.length}):`,
            },
            {
              content: this.renderSecondaryStructures(secondaryStructureContext.selectedSecondaryStructures),
              key: 'selected-secondary-structures',
              title: `Selected Secondary Structures (${secondaryStructureContext.selectedSecondaryStructures.length}):`,
            },
            {
              content: this.renderLockedResiduePairs(residueContext.lockedResiduePairs),
              key: 'selected-residue-pairs',
              title: `Selected Residue Pairs (${residueContext.lockedResiduePairs.size}):`,
            },
          ]}
        />
      </div>
    );
  }

  protected renderLockedResiduePairs(lockedResiduePairs: ResidueSelection) {
    return lockedResiduePairs.size === 0
      ? [<Label key={'locked-residue-pair-none'}>None</Label>]
      : Array.from(lockedResiduePairs.values()).map((pair, index) => (
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

  protected renderUnassignedResidues(pdbData: ChellPDB) {
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
              {`[${
                residue.resno
              }: isCg? ${residue.isCg()}, isDna? ${residue.isDna()}, isHelix? ${residue.isHelix()}, isNucleic? ${residue.isNucleic()}, isProtein? ${residue.isProtein()}, isPolymer? ${residue.isPolymer()}, isSaccharide? ${residue.isSaccharide()}, isSheet? ${residue.isSheet()}, isTurn? ${residue.isTurn()}`}
              }
            </Label>,
          );
        }
      }
    });
    return result;
  }
}

const InfoPanel = (props: any) => (
  <SecondaryStructureContext.Consumer>
    {secStructContext => (
      <ResidueContextHandler.Consumer>
        {residueContext => <InfoPanel {...props} {...residueContext} {...secStructContext} />}
      </ResidueContextHandler.Consumer>
    )}
  </SecondaryStructureContext.Consumer>
);

export default InfoPanel;
export { InfoPanel };
