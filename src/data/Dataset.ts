// ~bb-viz~
// Dataset
// Abstraction to allow custom namespaces/names for datasets.
// For example: bioblocks/tabula_muris vs hca/tabula_muris.
// ~bb-viz~

export class Dataset {
  constructor(readonly name: string, readonly namespace: string = 'bioblocks') {}

  public get fullName() {
    return `${this.namespace}/${this.name}`;
  }
}
