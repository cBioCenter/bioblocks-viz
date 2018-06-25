import * as NGL from 'ngl';
import { fetchNGLDataFromFile } from '../helper/DataHelper';
import { CONTACT_DISTANCE_PROXIMITY, ICouplingScore } from './chell-data';
import { CouplingContainer } from './CouplingContainer';

/**
 * A ChellPDB instance provides an API to interact with a loaded PDB file while hiding the implementation details of how it is loaded.
 *
 * @export
 */
export class ChellPDB {
  [key: string]: any;

  /**
   * Creates an instance of ChellPDB with PDB data.
   *
   * !IMPORTANT! Since fetching the data is an asynchronous action, this must be used to create a new instance!
   */
  public static async createPDB(filename: string = '') {
    const result = new ChellPDB();
    result.nglData = await fetchNGLDataFromFile(filename);
    return result;
  }

  protected nglData: NGL.Structure = new NGL.Structure();
  protected readonly NGL_C_ALPHA_INDEX = 'CA|C';

  /**
   * Given some existing coupling scores, a new CouplingContainer will be created with data augmented with info derived from this PDB.
   *
   * @param couplingScores A collection of coupling scores to be augmented.
   * @param measuredProximity How to calculate the distance between two residues.
   * @returns A CouplingContainer with contact information from both the original array and this PDB file.
   */
  public generateCouplingsAmendedWithPDB(
    couplingScores: ICouplingScore[],
    measuredProximity: CONTACT_DISTANCE_PROXIMITY,
  ) {
    const { residueStore } = this.nglData;
    const result = new CouplingContainer(couplingScores);
    const offset = residueStore.resno[0];
    const alphaId = this.nglData.atomMap.dict[this.NGL_C_ALPHA_INDEX];

    this.nglData.eachResidue(outerResidue => {
      const firstResidueIndex = outerResidue.resno - offset;
      this.nglData.eachResidue(innerResidue => {
        if (outerResidue.resno <= result.chainLength && innerResidue.resno <= result.chainLength) {
          const secondResidueIndex = innerResidue.resno - offset;

          if (measuredProximity === CONTACT_DISTANCE_PROXIMITY.C_ALPHA) {
            const firstResidueCAlphaIndex = this.getCAlphaAtomIndexFromResidue(firstResidueIndex, alphaId);
            const secondResidueCAlphaIndex = this.getCAlphaAtomIndexFromResidue(secondResidueIndex, alphaId);
            result.addCouplingScore({
              dist: this.nglData
                .getAtomProxy(firstResidueCAlphaIndex)
                .distanceTo(this.nglData.getAtomProxy(secondResidueCAlphaIndex)),
              i: outerResidue.resno,
              j: innerResidue.resno,
            });
          } else {
            result.addCouplingScore({
              dist: this.getMinDistBetweenResidues(firstResidueIndex, secondResidueIndex),
              i: outerResidue.resno,
              j: innerResidue.resno,
            });
          }
        }
      });
    });

    return result;
  }

  /**
   * Find the index of the c-alpha atom for a given residue.
   *
   * @param residueIndex Index of the residue to find the c-alpha atom for.
   * @param alphaId Index that determines if an atom is a c-alpha.
   * @returns Index of the c-alpha atom with respect to the array of all of the atoms.
   */
  protected getCAlphaAtomIndexFromResidue(residueIndex: number, alphaId: number): number {
    const { residueStore } = this.nglData;
    const atomOffset = residueStore.atomOffset[residueIndex];
    const atomCount = residueStore.atomCount[residueIndex];

    let result = atomOffset;
    while (residueStore.residueTypeId[result] !== alphaId && result < atomOffset + atomCount) {
      result++;
    }

    return result;
  }

  /**
   * Helper function to find the smallest possible distance between two residues via their atoms.
   *
   * @param firstResidueIndex Index of the first residue with respect to the array of all residues.
   * @param secondResidueIndex Index of the second residue with respect to the array of all residues.
   * @returns Shortest distance between the two residues in ångströms.
   */
  protected getMinDistBetweenResidues(firstResidueIndex: number, secondResidueIndex: number) {
    const { residueStore } = this.nglData;
    const firstResCount = residueStore.atomCount[firstResidueIndex];
    const secondResCount = residueStore.atomCount[secondResidueIndex];
    const firstAtomIndex = residueStore.atomOffset[firstResidueIndex];
    const secondAtomIndex = residueStore.atomOffset[secondResidueIndex];

    let minDist = Number.MAX_SAFE_INTEGER;
    for (let firstCounter = 0; firstCounter < firstResCount; ++firstCounter) {
      for (let secondCounter = 0; secondCounter < secondResCount; ++secondCounter) {
        minDist = Math.min(
          minDist,
          this.nglData
            .getAtomProxy(firstAtomIndex + firstCounter)
            .distanceTo(this.nglData.getAtomProxy(secondAtomIndex + secondCounter)),
        );
      }
    }
    return minDist;
  }

  protected async loadPdbFile(filename: string) {
    try {
      this.nglData = await fetchNGLDataFromFile(filename);
    } catch (e) {
      console.log(`Unable to parse PDB file ${filename}! Error: ${e}`);
    }
  }
}
