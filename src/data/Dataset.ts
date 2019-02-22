export class Dataset {
  constructor(readonly name: string, readonly namespace: string = 'bioblocks') {}

  public get fullName() {
    return `${this.namespace}/${this.name}`;
  }
}
