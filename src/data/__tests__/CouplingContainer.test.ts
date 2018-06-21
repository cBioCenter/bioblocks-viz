import { CouplingContainer } from '../CouplingContainer';

describe('CouplingContainer', () => {
  const sampleContacts = [{ i: 0, j: 1, dist: 1 }, { i: 1, j: 0, dist: 1 }];

  it('Should store a coupling [i=x, j=y] to the same place as [i=y, j=x].', () => {
    const result = new CouplingContainer(sampleContacts);
    expect(result.getCouplingScore(0, 1)).toEqual(result.getCouplingScore(1, 0));
  });

  it('Should tally unique number of couplings.', () => {
    const result = new CouplingContainer(sampleContacts);
    expect(result.totalContacts).toBe(1);
  });

  it('Should allow adding of new couplings.', () => {
    const result = new CouplingContainer(sampleContacts);
    result.addCouplingScore({ i: 2, j: 3, dist: 4 });
    expect(result.totalContacts).toBe(2);
  });

  it('Should allow updating of existing couplings.', () => {
    const result = new CouplingContainer(sampleContacts);
    const expected = 5;
    expect(result.getCouplingScore(0, 1).dist).not.toBe(expected);
    result.addCouplingScore({ i: 0, j: 1, dist: expected });
    expect(result.getCouplingScore(0, 1).dist).toBe(expected);
  });

  it('Should determine if a contact exists in storage regardless of order of [i, j].', () => {
    const result = new CouplingContainer([{ i: 0, j: 1, dist: 1 }]);
    expect(result.includes(0, 1)).toBe(true);
    expect(result.includes(1, 0)).toBe(true);
  });
});
