import * as NGL from 'ngl';
import { RESIDUE_TYPE } from '../data/chell-data';

export const createDistanceRepresentation = (
  structureComponent: NGL.StructureComponent,
  selection: string,
  color: string = 'skyblue',
  labelUnit: string = 'angstrom',
) =>
  structureComponent.addRepresentation('distance', {
    atomPair: [selection.split(',')],
    color,
    labelUnit,
  });

export const createBallStickRepresentation = (structureComponent: NGL.StructureComponent, residues: RESIDUE_TYPE[]) =>
  structureComponent.addRepresentation('ball+stick', {
    sele: residues.join(', '),
  });
