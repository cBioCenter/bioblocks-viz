import { AMINO_ACID_SINGLE_LETTER_CODES, AMINO_ACIDS_BY_SINGLE_LETTER_CODE, IAminoAcid } from './AminoAcid';
import { ICouplingScore } from './chell-data';

/**
 * A CouplingContainer provides access to the coupling information of residue pairs.
 *
 * Behind the scenes, it is backed by a spare 2D array to avoid data duplication and provide O(1) access.
 *
 * @export
 */
export class CouplingContainer implements IterableIterator<ICouplingScore> {
  protected contacts: ICouplingScore[][] = new Array<ICouplingScore[]>();

  /** How many distinct contacts are currently stored. */
  protected totalStoredContacts: number = 0;

  /** Used for iterator access. */
  private rowCounter = 0;

  /** Used for iterator access. */
  private colCounter = 0;

  public constructor(scores: ICouplingScore[] = []) {
    for (const score of scores) {
      this.addCouplingScore(score);
    }
  }

  public get allContacts() {
    return this.contacts;
  }

  public get chainLength() {
    return this.contacts.length;
  }

  public get rankedContacts() {
    return Array.from(this).sort((a, b) => {
      if (a.cn && b.cn) {
        return b.cn - a.cn;
      } else if (a.cn && !b.cn) {
        return -1;
      } else if (!a.cn && b.cn) {
        return 1;
      }
      return 0;
    });
  }

  public get totalContacts() {
    return this.totalStoredContacts;
  }

  public [Symbol.iterator](): IterableIterator<ICouplingScore> {
    return this;
  }

  /**
   * Add a coupling score to this collection. If there is already an entry for this (i,j) contact, it will be overridden!
   *
   * @param score A Coupling Score to add to the collection.
   */
  public addCouplingScore(score: ICouplingScore): void {
    const { i, j } = score;
    const minResidueIndex = Math.min(i, j) - 1;
    const maxResidueIndex = Math.max(i, j) - 1;
    if (!this.contacts[minResidueIndex]) {
      this.contacts[minResidueIndex] = new Array<ICouplingScore>();
    }
    if (!this.contacts[minResidueIndex][maxResidueIndex]) {
      this.totalStoredContacts++;
      this.contacts[minResidueIndex][maxResidueIndex] = score;
    } else {
      this.contacts[minResidueIndex][maxResidueIndex] = {
        ...this.contacts[minResidueIndex][maxResidueIndex],
        ...score,
      };
    }
  }

  public getAminoAcidOfContact(resno: number): IAminoAcid | undefined {
    const contact = this.allContacts[resno - 1]
      ? this.allContacts[resno - 1].find(aContact => aContact !== undefined && aContact.A_j !== undefined)
      : undefined;
    return contact ? AMINO_ACIDS_BY_SINGLE_LETTER_CODE[contact.A_j as AMINO_ACID_SINGLE_LETTER_CODES] : undefined;
  }

  /**
   * Determine which contacts in this coupling container are observed.
   *
   * @param [distFilter=5] For each score, if dist <= distFilter, it is considered observed.
   * @param [linearDistFilter=5] For each score, if |i - j| >= linearDistFilter, it will be a candidate for being correct/incorrect.
   * @returns Contacts that should be considered observed in the current data set.
   */
  public getObservedContacts(distFilter: number = 5, linearDistFilter = 5): ICouplingScore[] {
    const result = new Array<ICouplingScore>();
    for (const score of this) {
      if (score.dist <= distFilter && Math.abs(score.i - score.j) >= linearDistFilter) {
        result.push(score);
      }
    }

    return result;
  }

  /**
   * Determine which contacts in this coupling container are both predicted and correct.
   *
   * @param totalPredictionsToShow How many predictions, max, to return.
   * @param [linearDistFilter=5] For each score, if |i - j| >= linearDistFilter, it will be a candidate for being correct/incorrect.
   * @param [measuredContactDistFilter=5]  If the dist for the contact is less than predictionCutoffDist, it is considered correct.
   * @returns An object containing 2 array fields: correct and predicted.
   */
  public getPredictedContacts(totalPredictionsToShow: number, linearDistFilter = 5, measuredContactDistFilter = 5) {
    const result = {
      correct: new Array<ICouplingScore>(),
      predicted: new Array<ICouplingScore>(),
    };

    for (const contact of this.rankedContacts
      .filter(score => Math.abs(score.i - score.j) >= linearDistFilter)
      .slice(0, totalPredictionsToShow)) {
      if (contact.dist < measuredContactDistFilter) {
        result.correct.push(contact);
      }
      result.predicted.push(contact);
    }
    return result;
  }

  /**
   * Primary interface for getting a coupling score, provides access to the same data object regardless of order of (firstRes, secondRes).
   */
  public getCouplingScore = (firstRes: number, secondRes: number): ICouplingScore =>
    this.contacts[Math.min(firstRes, secondRes) - 1][Math.max(firstRes, secondRes) - 1];

  public includes = (firstRes: number, secondRes: number) =>
    this.contacts[Math.min(firstRes, secondRes) - 1][Math.max(firstRes, secondRes) - 1] !== undefined;

  public next(value?: any): IteratorResult<ICouplingScore> {
    for (let i = this.rowCounter; i < this.contacts.length; ++i) {
      if (this.contacts[i]) {
        for (let j = this.colCounter; j < this.contacts[i].length; ++j) {
          const score = this.contacts[i][j];
          if (score) {
            this.rowCounter = i;
            this.colCounter = j + 1;
            return {
              done: false,
              value: score,
            };
          }
        }
        this.colCounter = 0;
      }
    }

    this.rowCounter = 0;
    this.colCounter = 0;
    return {
      done: true,
      value: null as any,
    };
  }
}
