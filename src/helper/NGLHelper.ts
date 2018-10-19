import * as NGL from 'ngl';

import { RESIDUE_TYPE, SECONDARY_STRUCTURE_SECTION } from '~chell-viz~/data';

export const defaultRepParams: Partial<NGL.IStructureRepresentationParams> = {
  color: 'red',
  labelBackground: true,
  labelBackgroundColor: 'lightgrey',
  labelBackgroundMargin: 0.75,
  labelBorder: true,
  labelBorderColor: 'white',
  labelBorderWidth: 0.3,
  labelColor: 'black',
  labelSize: 5,
  labelUnit: 'angstrom',
  labelZOffset: 35,
};
/**
 * Draws a line between two residues in NGL.
 *
 * @param structureComponent The NGL Structure for which these residues belong to.
 * @param selection The [NGL Selection](http://nglviewer.org/ngl/api/manual/selection-language.html) defining the residues.
 */
export const createDistanceRepresentation = (
  structureComponent: NGL.StructureComponent,
  selection: string | number[],
  params: Partial<NGL.IStructureRepresentationParams> = {},
) =>
  structureComponent.addRepresentation('distance', {
    ...defaultRepParams,
    ...params,
    atomPair: Array.isArray(selection) ? [selection] : [selection.split(',')],
  });

/**
 * Marks a set of residues with a ball+stick representation in NGL.
 *
 * @param structureComponent The NGL Structure for which these residues belong to.
 * @param residues The residues to mark.
 */
export const createBallStickRepresentation = (structureComponent: NGL.StructureComponent, residues: RESIDUE_TYPE[]) =>
  structureComponent.addRepresentation('ball+stick', {
    sele: residues.join(', '),
  });

/**
 * Highlights a secondary structure in NGL.
 *
 * @param structureComponent The NGL Structure for which these residues belong to.
 * @param section The secondary structure section to highlight.
 * @param [radiusScale=5] How large to make the ribbon highlight.
 * @param [color='pink'] The color of the ribbon highlight.
 */
export const createSecStructRepresentation = (
  structureComponent: NGL.StructureComponent,
  section: SECONDARY_STRUCTURE_SECTION,
  radiusScale: number = 2,
  color: string = '#feb83f',
) => {
  const rep = structureComponent.addRepresentation('cartoon', {
    color,
    radiusScale,
    sele: `${section.start}-${section.end}`,
  });
  rep.setParameters({ wireframe: true });

  return rep;
};
