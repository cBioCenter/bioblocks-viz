import { AMINO_ACIDS_BY_SINGLE_LETTER_CODE, IAminoAcid, ICouplingScore } from '~chell-viz~/data';

/**
 * A CouplingContainer provides access to the coupling information of residue pairs.
 *
 * Behind the scenes, it is backed by a sparse 2D array to avoid data duplication and provide O(1) access.
 *
 * @export
 */
export class CouplingContainer implements IterableIterator<ICouplingScore> {
  protected contacts: ICouplingScore[][] = new Array<ICouplingScore[]>();

  /** How many distinct contacts are currently stored. */
  protected totalStoredContacts: number = 0;

  protected indexRange = {
    max: 50,
    min: 1,
  };

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
    return this.indexRange.max - this.indexRange.min + 1;
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

  public get residueIndexRange() {
    return this.indexRange;
  }

  public get sequence() {
    let result = '';
    for (let i = this.indexRange.min; i <= this.indexRange.max; ++i) {
      const aminoAcid = this.getAminoAcidOfContact(i);
      if (aminoAcid) {
        result += aminoAcid.singleLetterCode;
      }
    }

    return result;
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
    const { A_i, A_j, i, j } = score;

    const minResidueIndex = Math.min(i, j) - 1;
    const maxResidueIndex = Math.max(i, j) - 1;

    const isFlipped = minResidueIndex + 1 === j;

    if (!this.contacts[minResidueIndex]) {
      this.contacts[minResidueIndex] = new Array<ICouplingScore>();
    }
    if (!this.contacts[minResidueIndex][maxResidueIndex]) {
      this.totalStoredContacts++;
    }
    this.contacts[minResidueIndex][maxResidueIndex] = {
      ...this.contacts[minResidueIndex][maxResidueIndex],
      ...score,
    };

    if (isFlipped) {
      this.contacts[minResidueIndex][maxResidueIndex].i = j;
      this.contacts[minResidueIndex][maxResidueIndex].j = i;
      if (A_i && A_j) {
        this.contacts[minResidueIndex][maxResidueIndex].A_i = A_j;
        this.contacts[minResidueIndex][maxResidueIndex].A_j = A_i;
      }
    }

    this.indexRange = {
      max: Math.max(this.indexRange.max, maxResidueIndex + 1),
      min: Math.min(this.indexRange.min, minResidueIndex + 1),
    };
  }

  public getAminoAcidOfContact(resno: number): IAminoAcid | undefined {
    if (resno > this.chainLength + 1) {
      return undefined;
    }
    for (const outerContact of this.allContacts) {
      if (outerContact) {
        for (const innerContact of outerContact) {
          if (innerContact && innerContact.i === resno && innerContact.A_i) {
            return AMINO_ACIDS_BY_SINGLE_LETTER_CODE[innerContact.A_i];
          } else if (innerContact && innerContact.j === resno && innerContact.A_j) {
            return AMINO_ACIDS_BY_SINGLE_LETTER_CODE[innerContact.A_j];
          }
        }
      }
    }

    return undefined;
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
      if (score.dist && score.dist <= distFilter && Math.abs(score.i - score.j) >= linearDistFilter) {
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
      if (contact.dist && contact.dist < measuredContactDistFilter) {
        result.correct.push(contact);
      }
      result.predicted.push(contact);
    }

    return result;
  }

  /**
   * Primary interface for getting a coupling score, provides access to the same data object regardless of order of (firstRes, secondRes).
   */
  public getCouplingScore = (firstRes: number, secondRes: number): ICouplingScore | undefined => {
    const row = this.contacts[Math.min(firstRes, secondRes) - 1];

    return row ? row[Math.max(firstRes, secondRes) - 1] : undefined;
  };

  public includes = (firstRes: number, secondRes: number) =>
    this.contacts[Math.min(firstRes, secondRes) - 1] &&
    this.contacts[Math.min(firstRes, secondRes) - 1][Math.max(firstRes, secondRes) - 1] !== undefined;

  public next(): IteratorResult<ICouplingScore> {
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

  public updateContact(i: number, j: number, score: Partial<Omit<ICouplingScore, 'i' | 'j'>>) {
    this.addCouplingScore({ i, j, ...score });
  }
}
