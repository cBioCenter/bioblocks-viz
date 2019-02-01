export class Dataset {
  constructor(readonly name: string, readonly namespace: string = 'chell') {}

  public get fullName() {
    return `${this.namespace}/${this.name}`;
  }
}
