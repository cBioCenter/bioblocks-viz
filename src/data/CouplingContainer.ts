import { ICouplingScore } from './chell-data';

export class CouplingContainer {
  protected contactsLength: number = 0;
  protected maxResidueIndex: number = 0;

  protected contacts: ICouplingScore[][] = new Array<ICouplingScore[]>();
  protected rankedContacts: ICouplingScore[] = new Array<ICouplingScore>();

  public constructor(scores: ICouplingScore[] = []) {
    for (const score of scores) {
      this.addCouplingScore(score);
    }
  }

  public get totalContacts() {
    return this.contactsLength;
  }

  public get chainLength() {
    return this.maxResidueIndex;
  }

  public get allContacts() {
    return this.contacts;
  }

  public includes = (searchElement: ICouplingScore, fromIndex?: number | undefined) =>
    this.contacts[Math.min(searchElement.i, searchElement.j)][Math.max(searchElement.i, searchElement.j)] !== undefined;

  public getObservedContacts(distFilter: number): ICouplingScore[] {
    const result = new Array<ICouplingScore>();
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.contacts.length; ++i) {
      if (this.contacts[i]) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.contacts[i].length; ++j) {
          const score = this.contacts[i][j];
          if (score && score.dist <= distFilter) {
            result.push(score);
          }
        }
      }
    }

    return result;
  }

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

  public getCouplingScore = (firstRes: number, secondRes: number): ICouplingScore =>
    this.contacts[Math.min(firstRes, secondRes)][Math.max(firstRes, secondRes)];

  public addCouplingScore(score: ICouplingScore): void {
    const { i, j } = score;
    const minResidueIndex = Math.min(i, j);
    const maxResidueIndex = Math.max(i, j);
    this.contactsLength++;
    if (!this.contacts[minResidueIndex]) {
      this.contacts[minResidueIndex] = new Array<ICouplingScore>();
    }
    if (!this.contacts[minResidueIndex][maxResidueIndex]) {
      this.contacts[minResidueIndex][maxResidueIndex] = score;
      this.rankedContacts.push(score);
      this.maxResidueIndex = Math.max(maxResidueIndex, this.maxResidueIndex);
    } else {
      this.contacts[minResidueIndex][maxResidueIndex] = Object.assign(
        this.contacts[minResidueIndex][maxResidueIndex],
        score,
      );
    }
  }
}
