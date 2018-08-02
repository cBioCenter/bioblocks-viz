import { ICouplingScore } from '../chell-data';
import { CouplingContainer } from '../CouplingContainer';

describe('CouplingContainer', () => {
  // This same intentionally includes a mirrored pair, [i=1,j=0] and [i=0][j=1].
  const sampleContacts: ICouplingScore[] = [
    { cn: 0.5, i: 1, j: 2, dist: 1 },
    { cn: 0.5, i: 2, j: 1, dist: 1 },
    { cn: 0.7, i: 3, j: 4, dist: 5 },
    { cn: 0.2, i: 9, j: 8, dist: 7 },
  ];

  it('Should store a coupling [i=x, j=y] to the same place as [i=y, j=x].', () => {
    const result = new CouplingContainer(sampleContacts);
    expect(result.getCouplingScore(1, 2)).toEqual(result.getCouplingScore(2, 1));
  });

  it('Should tally unique number of couplings.', () => {
    const result = new CouplingContainer(sampleContacts);
    expect(result.totalContacts).toBe(3);
  });

  it('Should allow adding of new couplings.', () => {
    const result = new CouplingContainer(sampleContacts);
    result.addCouplingScore({ i: 2, j: 3, dist: 4 });
    expect(result.totalContacts).toBe(4);
  });

  it('Should allow updating of existing couplings.', () => {
    const result = new CouplingContainer(sampleContacts);
    const expected = 5;
    expect(result.getCouplingScore(1, 2).dist).not.toBe(expected);
    result.addCouplingScore({ i: 1, j: 2, dist: expected });
    expect(result.getCouplingScore(1, 2).dist).toBe(expected);
  });

  it('Should determine if a contact exists in storage regardless of order of [i, j].', () => {
    const result = new CouplingContainer([{ i: 1, j: 2, dist: 1 }]);
    expect(result.includes(1, 2)).toBe(true);
    expect(result.includes(2, 1)).toBe(true);
  });

  it('Should allow iterators to iterate through existing contacts.', () => {
    const result = new CouplingContainer(sampleContacts);
    for (const contact of result) {
      expect(sampleContacts).toContainEqual(contact);
    }
  });

  it('Should allow retrieving the contacts sorted by rank.', () => {
    const result = new CouplingContainer(sampleContacts).rankedContacts;
    const expected = [sampleContacts[2], sampleContacts[1], sampleContacts[3]];
    expect(result).toEqual(expected);
  });

  it('Should allow have contacts with undefined cn values at the bottom of the sorted list.', () => {
    const dummyScores = [{ i: 1, j: 1, dist: 0 }, { i: 2, j: 2, dist: 1 }, { i: 11, j: 11, dist: 11 }];
    for (const score of dummyScores) {
      const result = new CouplingContainer([score, ...sampleContacts]).rankedContacts;
      const expected = [sampleContacts[2], sampleContacts[1], sampleContacts[3], score];
      expect(result).toEqual(expected);
    }
  });
});
