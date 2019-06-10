import { AMINO_ACID_BY_CODE, COUPLING_SCORE_SOURCE, CouplingContainer, ICouplingScore } from '~bioblocks-viz~/data';

describe('CouplingContainer', () => {
  // This same intentionally includes a mirrored pair, [i=1,j=0] and [i=0][j=1].
  const sampleContacts: ICouplingScore[] = [
    { cn: 0.5, i: 1, j: 2, dist: 1 },
    { cn: 0.5, i: 2, j: 1, dist: 1 },
    { cn: 0.7, i: 3, j: 4, dist: 5 },
    { cn: 0.2, i: 8, j: 9, dist: 7 },
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
    let score = result.getCouplingScore(1, 2);
    if (!score) {
      expect(score).not.toBeUndefined();
    } else {
      expect(score.dist).not.toBe(expected);
    }
    result.addCouplingScore({ i: 1, j: 2, dist: expected });
    score = result.getCouplingScore(1, 2);
    if (!score) {
      expect(score).not.toBeUndefined();
    } else {
      expect(score.dist).toBe(expected);
    }
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
    const expected = [sampleContacts[2], sampleContacts[0], sampleContacts[3]];
    expect(result).toEqual(expected);
  });

  it('Should return undefined when getting a contact out of bounds.', () => {
    const result = new CouplingContainer(sampleContacts);
    expect(result.getAminoAcidOfContact(777)).toBeUndefined();
    expect(result.getCouplingScore(777, 777)).toBeUndefined();
  });

  it('Should allow have contacts with undefined cn values at the bottom of the sorted list.', () => {
    const dummyScores = [{ i: 1, j: 1, dist: 0 }, { i: 2, j: 2, dist: 1 }, { i: 11, j: 11, dist: 11 }];
    for (const score of dummyScores) {
      const result = new CouplingContainer([score, ...sampleContacts]).rankedContacts;
      const expected = [sampleContacts[2], sampleContacts[0], sampleContacts[3], score];
      expect(result).toEqual(expected);
    }
  });

  it('Should return the correct amino acid sequence for a set of contacts.', () => {
    const contacts: ICouplingScore[] = [
      { A_i: 'A', A_j: 'T', cn: 0.5, i: 1, j: 3, dist: 1 },
      { A_i: 'R', A_j: 'A', cn: 0.5, i: 2, j: 1, dist: 1 },
      { A_i: 'T', A_j: 'R', cn: 0.5, i: 3, j: 2, dist: 1 },
      { A_i: 'R', A_j: 'T', cn: 0.5, i: 2, j: 3, dist: 1 },
      { A_i: 'S', A_j: 'A', cn: 0.5, i: 4, j: 1, dist: 1 },
      { A_i: 'T', A_j: 'Y', cn: 0.5, i: 3, j: 5, dist: 1 },
    ];
    const container = new CouplingContainer(contacts);
    expect(container.sequence).toEqual('ARTSY');
  });

  it('Should return the correct amino acid sequence for a set of contacts when indices are flipped.', () => {
    const contacts: ICouplingScore[] = [
      { A_i: 'T', A_j: 'A', cn: 0.5, i: 3, j: 1, dist: 1 },
      { A_i: 'A', A_j: 'R', cn: 0.5, i: 1, j: 2, dist: 1 },
      { A_i: 'R', A_j: 'T', cn: 0.5, i: 2, j: 3, dist: 1 },
      { A_i: 'T', A_j: 'R', cn: 0.5, i: 3, j: 2, dist: 1 },
      { A_i: 'A', A_j: 'S', cn: 0.5, i: 1, j: 4, dist: 1 },
      { A_i: 'Y', A_j: 'T', cn: 0.5, i: 5, j: 3, dist: 1 },
    ];
    const container = new CouplingContainer(contacts);
    expect(container.sequence).toEqual('ARTSY');
  });

  it('Should return the correct amino acid sequence for a set of contacts when they are updated and flipped.', () => {
    const contacts: ICouplingScore[] = [
      { cn: 0.5, i: 3, j: 1, dist: 1 },
      { cn: 0.5, i: 1, j: 2, dist: 1 },
      { cn: 0.5, i: 2, j: 3, dist: 1 },
      { cn: 0.5, i: 3, j: 2, dist: 1 },
      { cn: 0.5, i: 1, j: 4, dist: 1 },
      { cn: 0.5, i: 5, j: 3, dist: 1 },
    ];
    const container = new CouplingContainer(contacts);
    container.updateContact(3, 1, { A_i: 'T', A_j: 'A' });
    container.updateContact(1, 2, { A_i: 'A', A_j: 'R' });
    container.updateContact(2, 3, { A_i: 'R', A_j: 'T' });
    container.updateContact(3, 2, { A_i: 'T', A_j: 'R' });
    container.updateContact(1, 4, { A_i: 'A', A_j: 'S' });
    container.updateContact(5, 3, { A_i: 'Y', A_j: 'T' });
    expect(container.sequence).toEqual('ARTSY');
  });

  it('Should return the correct amino acid sequence for a set of contacts when they are updated and not flipped.', () => {
    const contacts: ICouplingScore[] = [
      { cn: 0.5, i: 1, j: 3, dist: 1 },
      { cn: 0.5, i: 2, j: 1, dist: 1 },
      { cn: 0.5, i: 3, j: 2, dist: 1 },
      { cn: 0.5, i: 2, j: 3, dist: 1 },
      { cn: 0.5, i: 4, j: 1, dist: 1 },
      { cn: 0.5, i: 3, j: 5, dist: 1 },
    ];
    const container = new CouplingContainer(contacts);
    container.updateContact(1, 3, { A_i: 'A', A_j: 'T' });
    container.updateContact(2, 1, { A_i: 'R', A_j: 'A' });
    container.updateContact(3, 2, { A_i: 'T', A_j: 'R' });
    container.updateContact(2, 3, { A_i: 'R', A_j: 'T' });
    container.updateContact(4, 1, { A_i: 'S', A_j: 'A' });
    container.updateContact(3, 5, { A_i: 'T', A_j: 'Y' });
    expect(container.sequence).toEqual('ARTSY');
  });

  describe('Amino acid helper', () => {
    it('Should return undefined when retrieving an amino acid from an empty Coupling Container.', () => {
      const container = new CouplingContainer();
      expect(container.getAminoAcidOfContact(2)).toEqual(undefined);
      expect(() => new CouplingContainer().getAminoAcidOfContact(0)).not.toThrow();
    });

    it('Should return undefined when an amino acid that has not been stored is retrieved.', () => {
      const container = new CouplingContainer();
      expect(container.getAminoAcidOfContact(3)).toEqual(undefined);
      expect(() => new CouplingContainer(sampleContacts).getAminoAcidOfContact(0)).not.toThrow();
    });

    it('Should allow the correct amino acid corresponding to an individual contact to be retrieved.', () => {
      const contacts: ICouplingScore[] = [
        { A_i: 'A', A_j: 'N', cn: 0.5, i: 1, j: 2, dist: 1 },
        { A_i: 'N', A_j: 'A', cn: 0.5, i: 2, j: 1, dist: 1 },
      ];
      const container = new CouplingContainer(contacts);
      expect(container.getAminoAcidOfContact(1)).toEqual(AMINO_ACID_BY_CODE.A);
      expect(container.getAminoAcidOfContact(2)).toEqual(AMINO_ACID_BY_CODE.N);
    });
  });

  describe('Scores', () => {
    it('Should allow sorting by different score sources.', () => {
      const sampleScores = [
        { i: 1, j: 10, cn: 6, dist: 0, dist_intra: 1, dist_multimer: 2, fn: 3, probability: 4, precision: 5 },
        { i: 2, j: 11, cn: 5, dist: 6, dist_intra: 0, dist_multimer: 1, fn: 2, probability: 3, precision: 4 },
        { i: 3, j: 12, cn: 4, dist: 5, dist_intra: 6, dist_multimer: 0, fn: 1, probability: 2, precision: 3 },
        { i: 4, j: 13, cn: 3, dist: 4, dist_intra: 5, dist_multimer: 6, fn: 0, probability: 1, precision: 2 },
        { i: 5, j: 14, cn: 2, dist: 3, dist_intra: 4, dist_multimer: 5, fn: 6, probability: 0, precision: 1 },
        { i: 6, j: 15, cn: 1, dist: 2, dist_intra: 3, dist_multimer: 4, fn: 5, probability: 6, precision: 0 },
        { i: 7, j: 16, cn: 0, dist: 1, dist_intra: 2, dist_multimer: 3, fn: 4, probability: 5, precision: 6 },
      ];

      const undefinedScores = [{ i: 8, j: 17 }, { i: 9, j: 18 }];

      let expected = Array.from(sampleScores);
      Object.keys(COUPLING_SCORE_SOURCE).forEach(scoreSource => {
        const result = new CouplingContainer(
          [...sampleScores, ...undefinedScores],
          scoreSource as COUPLING_SCORE_SOURCE,
        ).rankedContacts;

        expect(result).toEqual([...expected, ...undefinedScores]);
        expected = [...expected.slice(1, expected.length), expected[0]];
      });
    });

    it('Should sort the scores by cn if an invalid source is provided.', () => {
      const sampleScores = [
        { i: 1, j: 10, cn: 6, dist: 0, dist_intra: 1, dist_multimer: 2, fn: 3, probability: 4, precision: 5 },
        { i: 2, j: 11, cn: 5, dist: 6, dist_intra: 0, dist_multimer: 1, fn: 2, probability: 3, precision: 4 },
        { i: 3, j: 12, cn: 4, dist: 5, dist_intra: 6, dist_multimer: 0, fn: 1, probability: 2, precision: 3 },
        { i: 4, j: 13, cn: 3, dist: 4, dist_intra: 5, dist_multimer: 6, fn: 0, probability: 1, precision: 2 },
        { i: 5, j: 14, cn: 2, dist: 3, dist_intra: 4, dist_multimer: 5, fn: 6, probability: 0, precision: 1 },
        { i: 6, j: 15, cn: 1, dist: 2, dist_intra: 3, dist_multimer: 4, fn: 5, probability: 6, precision: 0 },
        { i: 7, j: 16, cn: 0, dist: 1, dist_intra: 2, dist_multimer: 3, fn: 4, probability: 5, precision: 6 },
      ];

      const result = new CouplingContainer(sampleScores, 'smoke' as any).rankedContacts;
      const expected = Array.from(sampleScores);
      expect(result).toEqual(expected);
    });
  });
});
