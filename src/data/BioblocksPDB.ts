// ~bb-viz~
// Bioblocks PDB
// Wrapper to hold a PDB instance and provide useful functions to interact with it.
// ~bb-viz~

import * as crypto from 'crypto';
import { ILoaderParameters, ResidueProxy, Structure } from 'ngl';
import { inspect } from 'util';

import {
  AminoAcid,
  Bioblocks1DSection,
  CONTACT_DISTANCE_PROXIMITY,
  CouplingContainer,
  ICouplingScore,
  IResidueMismatchResult,
  ISecondaryStructureData,
  SECONDARY_STRUCTURE_KEYS,
  SECONDARY_STRUCTURE_SECTION,
} from '~bioblocks-viz~/data';
import { NGLInstanceManager } from '~bioblocks-viz~/helper';

/**
 * A BioblocksPDB instance provides an API to interact with a loaded PDB file while hiding the implementation details of how it is loaded.
 *
 * @export
 */
export class BioblocksPDB {
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

  public get name(): string {
    const splitName = this.fileName.split('/');
    const lastPart = splitName[splitName.length - 1];
    const lastIndex = lastPart.lastIndexOf('.');

    return lastPart.slice(0, lastIndex === -1 ? undefined : lastIndex);
  }

  public get nglStructure(): Structure {
    return this.nglData;
  }

  public get rank(): string {
    return 'UNK';
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
        this.getSecStructFromNGLResidue(residue, result);
      }
    });

    return result;
  }

  public get path(): string {
    return this.fileName;
  }

  public get sequence(): string {
    return this.nglData ? this.nglData.getSequence().join('') : '';
  }

  public get source(): string {
    return 'UKN';
  }

  public get uuid(): string {
    return this.id;
  }

  public set uuid(uuid: string) {
    this.id = uuid;
  }

  public static readonly NGL_C_ALPHA_INDEX = 'CA|C';

  /**
   * Helper function to determine if two BioblocksPDB arrays are equal.
   * By default, PDB equality is determined by PDB name - this can be overridden by supplying a custom comparison function.
   */
  public static arePDBArraysEqual = (
    firstArray: BioblocksPDB[],
    secondArray: BioblocksPDB[],
    compFn = (a: BioblocksPDB, b: BioblocksPDB) => a.uuid === b.uuid,
  ) => {
    for (const outerPDB of firstArray) {
      if (secondArray.findIndex(innerPDB => compFn(innerPDB, outerPDB)) === -1) {
        return false;
      }
    }

    return firstArray.length === secondArray.length;
  };

  public static createEmptyPDB() {
    return new BioblocksPDB();
  }

  /**
   * Creates an instance of BioblocksPDB with PDB data.
   *
   * !IMPORTANT! Since fetching the data is an asynchronous action, this must be used to create a new instance!
   */
  public static async createPDB(file: File | string = '', fileLoaderParams: Partial<ILoaderParameters> = {}) {
    const result = new BioblocksPDB();
    result.nglData = (await NGLInstanceManager.instance.autoLoad(file, fileLoaderParams)) as Structure;
    result.fileName = typeof file === 'string' ? file : file.name;
    const hash = crypto.createHash('sha1');
    hash.update(inspect(result.nglData, false, 2));
    result.uuid = hash.digest('hex');

    return result;
  }

  public static createPDBFromNGLData(nglData: Structure) {
    const result = new BioblocksPDB();
    result.nglData = nglData;
    result.fileName = nglData.path ? nglData.path : nglData.name;
    const hash = crypto.createHash('sha1');
    hash.update(inspect(result.nglData, false, 2));
    result.uuid = hash.digest('hex');

    return result;
  }

  protected contactInfo?: CouplingContainer;
  protected fileName: string = '';
  protected nglData: Structure = new NGLInstanceManager.instance.Structure();
  protected id: string = '';

  private constructor() {}

  public eachResidue(callback: (residue: ResidueProxy) => void) {
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
    const alphaId = this.nglData.atomMap.dict[BioblocksPDB.NGL_C_ALPHA_INDEX];
    const minDist: {
      [key: string]: number;
    } = {};

    this.nglData.eachResidue(outerResidue => {
      this.nglData.eachResidue(innerResidue => {
        if (outerResidue.isProtein() && innerResidue.isProtein()) {
          if (measuredProximity === CONTACT_DISTANCE_PROXIMITY.C_ALPHA) {
            const firstResidueCAlphaIndex = this.getCAlphaAtomIndexFromResidue(outerResidue.index, alphaId);
            const secondResidueCAlphaIndex = this.getCAlphaAtomIndexFromResidue(innerResidue.index, alphaId);
            const dist = this.nglData
              .getAtomProxy(firstResidueCAlphaIndex)
              .distanceTo(this.nglData.getAtomProxy(secondResidueCAlphaIndex));
            if (dist !== 0) {
              result.addCouplingScore({
                dist,
                i: outerResidue.resno,
                j: innerResidue.resno,
              });
            }
          } else {
            const key = `${Math.min(outerResidue.resno, innerResidue.resno)},${Math.max(
              outerResidue.resno,
              innerResidue.resno,
            )}`;
            if (!minDist[key]) {
              minDist[key] = this.getMinDistBetweenResidueIndices(outerResidue.index, innerResidue.index).dist;
            }

            if (minDist[key] !== 0) {
              result.addCouplingScore({
                dist: minDist[key],
                i: outerResidue.resno,
                j: innerResidue.resno,
              });
            }
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
        AminoAcid.fromSingleLetterCode(pdbResCode) !==
          AminoAcid.fromSingleLetterCode(couplingAminoAcid.singleLetterCode)
      ) {
        const caa = AminoAcid.fromSingleLetterCode(couplingAminoAcid.singleLetterCode);
        const paa = AminoAcid.fromFullName(pdbResCode);
        if (caa !== undefined && paa !== undefined) {
          result.push({
            couplingAminoAcid: caa,
            pdbAminoAcid: paa,
            resno: residue.resno,
          });
        }
      }
    });

    return result;
  }

  public getTrimmedName(
    separator: string = '_',
    wordsToTrim: number = 3,
    direction: 'front' | 'back' = 'back',
  ): string {
    const splitName = this.name.split(separator);

    if (splitName.length > wordsToTrim) {
      return (direction === 'back'
        ? splitName.slice(0, splitName.length - wordsToTrim)
        : splitName.slice(wordsToTrim)
      ).join(separator);
    } else {
      return this.name;
    }
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

  protected getSecStructFromNGLResidue = (residue: ResidueProxy, result: SECONDARY_STRUCTURE_SECTION[][]) => {
    const { chainIndex } = residue;
    while (!result[chainIndex]) {
      result.push(new Array<SECONDARY_STRUCTURE_SECTION>());
    }

    let structId = 'C' as SECONDARY_STRUCTURE_KEYS;
    if (residue.isSheet()) {
      structId = 'E';
    } else if (residue.isHelix()) {
      structId = 'H';
    }

    if (result[chainIndex].length >= 1 && result[chainIndex][result[chainIndex].length - 1].label === structId) {
      result[chainIndex][result[chainIndex].length - 1].updateEnd(residue.resno);
    } else {
      result[chainIndex].push(new Bioblocks1DSection(structId, residue.resno));
    }
  };
}
