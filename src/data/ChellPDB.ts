import * as NGL from 'ngl';

import {
  AMINO_ACID_THREE_LETTER_CODE,
  AMINO_ACIDS_BY_SINGLE_LETTER_CODE,
  AMINO_ACIDS_BY_THREE_LETTER_CODE,
  Chell1DSection,
  CONTACT_DISTANCE_PROXIMITY,
  CouplingContainer,
  IAminoAcid,
  ICouplingScore,
  ISecondaryStructureData,
  SECONDARY_STRUCTURE_KEYS,
  SECONDARY_STRUCTURE_SECTION,
} from '~chell-viz~/data';

export interface IResidueMismatchResult {
  couplingAminoAcid: IAminoAcid;
  pdbAminoAcid: IAminoAcid;
  resno: number;
}

/**
 * A ChellPDB instance provides an API to interact with a loaded PDB file while hiding the implementation details of how it is loaded.
 *
 * @export
 */
export class ChellPDB {
  public static readonly NGL_C_ALPHA_INDEX = 'CA|C';

  /**
   * Creates an instance of ChellPDB with PDB data.
   *
   * !IMPORTANT! Since fetching the data is an asynchronous action, this must be used to create a new instance!
   */
  public static async createPDB(file: File | string = '') {
    const result = new ChellPDB();
    result.nglData = await NGL.autoLoad(file);
    return result;
  }

  public static createPDBFromNGLData(nglData: NGL.Structure) {
    const result = new ChellPDB();
    result.nglData = nglData;
    return result;
  }

  protected contactInfo?: CouplingContainer = undefined;

  public get contactInformation(): CouplingContainer {
    if (!this.contactInfo) {
      const result = new CouplingContainer();
      this.nglData.eachResidue(outerResidue => {
        if (outerResidue.isProtein()) {
          const i = outerResidue.resno;
          this.nglData.eachResidue(innerResidue => {
            const j = innerResidue.resno;
            if (innerResidue.isProtein() && i !== j) {
              result.addCouplingScore({
                dist: this.getMinDistBetweenResidues(i, j).dist,
                i,
                j,
              });
            }
          });
        }
      });
      this.contactInfo = result;
    }
    return this.contactInfo;
  }

  public get nglStructure(): NGL.Structure {
    return this.nglData;
  }

  public get secondaryStructure(): ISecondaryStructureData[] {
    const result = new Array<ISecondaryStructureData>();
    this.nglData.eachResidue(residue => {
      if (residue.isProtein()) {
        let structId = 'C' as SECONDARY_STRUCTURE_KEYS;
        if (residue.isSheet()) {
          structId = 'E';
        } else if (residue.isHelix()) {
          structId = 'H';
        } else if (residue.isTurn()) {
          return;
        }
        result.push({ resno: residue.resno, structId });
      }
    });
    return result;
  }

  public get secondaryStructureSections(): SECONDARY_STRUCTURE_SECTION[][] {
    const result = new Array<SECONDARY_STRUCTURE_SECTION[]>();
    this.nglData.eachResidue(residue => {
      if (residue.isProtein()) {
        const { chainIndex } = residue;
        while (!result[chainIndex]) {
          result.push(new Array<SECONDARY_STRUCTURE_SECTION>());
        }
        let structId = 'C' as SECONDARY_STRUCTURE_KEYS;
        if (residue.isSheet()) {
          structId = 'E';
        } else if (residue.isHelix()) {
          structId = 'H';
        } else if (residue.isTurn()) {
          return;
        }
        if (result[chainIndex].length >= 1 && result[chainIndex][result[chainIndex].length - 1].label === structId) {
          result[chainIndex][result[chainIndex].length - 1].updateEnd(residue.resno);
        } else {
          result[chainIndex].push(new Chell1DSection(structId, residue.resno));
        }
      }
    });
    return result;
  }

  public get sequence(): string {
    return this.nglData ? this.nglData.getSequence().join('') : '';
  }

  protected nglData: NGL.Structure = new NGL.Structure();

  private constructor() {}

  public eachResidue(callback: (residue: NGL.ResidueProxy) => void) {
    this.nglData.eachResidue(callback);
  }

  /**
   * Given some existing coupling scores, a new CouplingContainer will be created with data augmented with info derived from this PDB.
   *
   * @param couplingScores A collection of coupling scores to be augmented.
   * @param measuredProximity How to calculate the distance between two residues.
   * @returns A CouplingContainer with contact information from both the original array and this PDB file.
   */
  public amendPDBWithCouplingScores(couplingScores: ICouplingScore[], measuredProximity: CONTACT_DISTANCE_PROXIMITY) {
    const result = new CouplingContainer(couplingScores);
    const alphaId = this.nglData.atomMap.dict[ChellPDB.NGL_C_ALPHA_INDEX];

    const minDist: {
      [key: string]: number;
    } = {};

    this.nglData.eachResidue(outerResidue => {
      this.nglData.eachResidue(innerResidue => {
        if (outerResidue.isProtein() && innerResidue.isProtein()) {
          if (measuredProximity === CONTACT_DISTANCE_PROXIMITY.C_ALPHA) {
            const firstResidueCAlphaIndex = this.getCAlphaAtomIndexFromResidue(outerResidue.index, alphaId);
            const secondResidueCAlphaIndex = this.getCAlphaAtomIndexFromResidue(innerResidue.index, alphaId);
            result.addCouplingScore({
              dist: this.nglData
                .getAtomProxy(firstResidueCAlphaIndex)
                .distanceTo(this.nglData.getAtomProxy(secondResidueCAlphaIndex)),
              i: outerResidue.resno,
              j: innerResidue.resno,
            });
          } else {
            const key = `${Math.min(outerResidue.resno, innerResidue.resno)},${Math.max(
              outerResidue.resno,
              innerResidue.resno,
            )}`;
            if (!minDist[key]) {
              minDist[key] = this.getMinDistBetweenResidueIndices(outerResidue.index, innerResidue.index).dist;
            }
            result.addCouplingScore({
              dist: minDist[key],
              i: outerResidue.resno,
              j: innerResidue.resno,
            });
          }
        }
      });
    });

    this.contactInfo = result;
    return this.contactInfo;
  }

  /**
   * Find the index of the c-alpha atom for a given residue.
   *
   * @param residueIndex Index of the residue to find the c-alpha atom for.
   * @param alphaId Index that determines if an atom is a c-alpha.
   * @returns Index of the c-alpha atom with respect to the array of all of the atoms.
   */
  public getCAlphaAtomIndexFromResidue(residueIndex: number, alphaId: number): number {
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
   * @param resnoI The first residue.
   * @param resnoJ The second residue.
   * @returns Shortest distance between the two residues in ångströms.
   */
  public getMinDistBetweenResidues(resnoI: number, resnoJ: number) {
    return this.getMinDistBetweenResidueIndices(
      this.nglData.residueStore.resno.indexOf(resnoI),
      this.nglData.residueStore.resno.indexOf(resnoJ),
    );
  }

  public getResidueNumberingMismatches(contacts: CouplingContainer) {
    const result = new Array<IResidueMismatchResult>();
    this.eachResidue(residue => {
      const pdbResCode = residue.resname.toUpperCase();
      const couplingAminoAcid = contacts.getAminoAcidOfContact(residue.resno);
      if (
        couplingAminoAcid &&
        AMINO_ACIDS_BY_THREE_LETTER_CODE[pdbResCode as AMINO_ACID_THREE_LETTER_CODE] !==
          AMINO_ACIDS_BY_SINGLE_LETTER_CODE[couplingAminoAcid.singleLetterCode]
      ) {
        result.push({
          couplingAminoAcid,
          pdbAminoAcid: AMINO_ACIDS_BY_THREE_LETTER_CODE[pdbResCode as AMINO_ACID_THREE_LETTER_CODE],
          resno: residue.resno,
        });
      }
    });
    return result;
  }

  /**
   * Helper function to find the smallest possible distance between two residues via their atoms.
   *
   * @param indexI Index of the first residue with respect to the array of all residues.
   * @param indexJ Index of the second residue with respect to the array of all residues.
   * @returns Shortest distance between the two residues in ångströms.
   */
  protected getMinDistBetweenResidueIndices(indexI: number, indexJ: number) {
    const { residueStore } = this.nglData;
    const firstResCount = residueStore.atomCount[indexI];
    const secondResCount = residueStore.atomCount[indexJ];
    const firstAtomIndex = residueStore.atomOffset[indexI];
    const secondAtomIndex = residueStore.atomOffset[indexJ];

    let result = {
      atomIndexI: -1,
      atomIndexJ: -1,
      dist: Number.MAX_SAFE_INTEGER,
    };
    for (let firstCounter = 0; firstCounter < firstResCount; ++firstCounter) {
      for (let secondCounter = 0; secondCounter < secondResCount; ++secondCounter) {
        const atomIndexI = firstAtomIndex + firstCounter;
        const atomIndexJ = secondAtomIndex + secondCounter;
        const dist = this.nglData.getAtomProxy(atomIndexI).distanceTo(this.nglData.getAtomProxy(atomIndexJ));
        if (dist < result.dist) {
          result = {
            atomIndexI,
            atomIndexJ,
            dist,
          };
        }
      }
    }
    return result;
  }
}
