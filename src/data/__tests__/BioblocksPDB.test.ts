import {
  AminoAcid,
  BioblocksPDB,
  CONTACT_DISTANCE_PROXIMITY,
  CouplingContainer,
  ICouplingScore,
} from '~bioblocks-viz~/data';
import { NGLInstanceManager } from '~bioblocks-viz~/helper';

describe('BioblocksPDB', () => {
  it('Should allow creation of an empty PDB.', () => {
    const result = BioblocksPDB.createEmptyPDB();
    expect(result.name).toEqual('');
    expect(JSON.stringify(result.nglStructure)).toEqual(JSON.stringify(new NGLInstanceManager.instance.Structure()));
  });

  it('Should handle loading an existing PDB file.', async () => {
    const result = BioblocksPDB.createPDB('protein.pdb');
    await expect(result).toBeDefined();
  });

  it('Should handle loading a non-existent PDB file.', async () => {
    expect.assertions(1);
    await expect(BioblocksPDB.createPDB('error/protein.pdb')).rejects.toEqual('Invalid NGL path.');
  });

  it('Should correctly handle naming the pdb.', async () => {
    let result = await BioblocksPDB.createPDB('protein.pdb');
    expect(result.name).toEqual('protein');

    result = await BioblocksPDB.createPDB('folder/protein.pdb');
    expect(result.name).toEqual('protein');

    result = await BioblocksPDB.createPDB('protein');
    expect(result.name).toEqual('protein');
  });

  it('Should correctly handle getting the secondary structure.', async () => {
    const expected = [
      { resno: 1, structId: 'H' },
      { resno: 2, structId: 'E' },
    ];
    const result = await BioblocksPDB.createPDB('sample.pdb');
    expect(result.secondaryStructure).toEqual(expected);
  });

  it('Should correctly handle getting the secondary structure sections.', async () => {
    const expected = [
      [
        { label: 'H', sectionEnd: 1, sectionStart: 1 },
        { label: 'E', sectionEnd: 2, sectionStart: 2 },
        { label: 'C', sectionEnd: 3, sectionStart: 3 },
      ],
    ];
    const result = await BioblocksPDB.createPDB('sample.pdb');
    expect(result.secondaryStructureSections).toEqual(expected);
  });

  it('Should correctly handle getting the secondary structure sections for multiple chains.', async () => {
    const expected = [
      [
        { label: 'H', sectionEnd: 1, sectionStart: 1 },
        { label: 'E', sectionEnd: 2, sectionStart: 2 },
        { label: 'C', sectionEnd: 3, sectionStart: 3 },
      ],
      [{ label: 'H', sectionEnd: 3, sectionStart: 1 }],
    ];
    const result = await BioblocksPDB.createPDB('chain.pdb');
    expect(result.secondaryStructureSections).toEqual(expected);
  });

  it('Should allow amending the PDB with coupling scores and C-Alpha as a proximity metric.', async () => {
    const result = await BioblocksPDB.createPDB('sample.pdb');
    const prevContacts = result.contactInformation;
    const contacts: ICouplingScore[] = [
      { A_i: 'A', A_j: 'T', cn: 0.5, i: 1, j: 3, dist: 1 },
      { A_i: 'R', A_j: 'A', cn: 0.5, i: 2, j: 1, dist: 1 },
      { A_i: 'T', A_j: 'R', cn: 0.5, i: 3, j: 2, dist: 1 },
      { A_i: 'R', A_j: 'T', cn: 0.5, i: 2, j: 3, dist: 1 },
      { A_i: 'S', A_j: 'A', cn: 0.5, i: 4, j: 1, dist: 1 },
      { A_i: 'T', A_j: 'Y', cn: 0.5, i: 3, j: 5, dist: 1 },
    ];
    result.amendPDBWithCouplingScores(contacts, CONTACT_DISTANCE_PROXIMITY.C_ALPHA);
    expect(prevContacts).not.toEqual(contacts);
  });

  it('Should allow amending the PDB with coupling scores and closest atom as a proximity metric.', async () => {
    const result = await BioblocksPDB.createPDB('sample.pdb');
    const prevContacts = result.contactInformation;
    const contacts: ICouplingScore[] = [
      { A_i: 'A', A_j: 'T', cn: 0.5, i: 1, j: 3, dist: 1 },
      { A_i: 'R', A_j: 'A', cn: 0.5, i: 2, j: 1, dist: 1 },
      { A_i: 'T', A_j: 'R', cn: 0.5, i: 3, j: 2, dist: 1 },
      { A_i: 'R', A_j: 'T', cn: 0.5, i: 2, j: 3, dist: 1 },
      { A_i: 'S', A_j: 'A', cn: 0.5, i: 4, j: 1, dist: 1 },
      { A_i: 'T', A_j: 'Y', cn: 0.5, i: 3, j: 5, dist: 1 },
    ];
    result.amendPDBWithCouplingScores(contacts, CONTACT_DISTANCE_PROXIMITY.CLOSEST);
    expect(prevContacts).not.toEqual(contacts);
  });

  it('Should allow getting residue mismatch information.', async () => {
    const result = await BioblocksPDB.createPDB('sample.pdb');
    const contacts: ICouplingScore[] = [
      { A_i: 'A', A_j: 'T', cn: 0.5, i: 1, j: 3, dist: 1 },
      { A_i: 'R', A_j: 'A', cn: 0.5, i: 2, j: 1, dist: 1 },
      { A_i: 'T', A_j: 'R', cn: 0.5, i: 3, j: 2, dist: 1 },
      { A_i: 'R', A_j: 'T', cn: 0.5, i: 2, j: 3, dist: 1 },
      { A_i: 'S', A_j: 'A', cn: 0.5, i: 4, j: 1, dist: 1 },
      { A_i: 'T', A_j: 'Y', cn: 0.5, i: 3, j: 5, dist: 1 },
    ];

    const mismatchedContacts: ICouplingScore[] = [
      { A_i: 'A', A_j: 'T', cn: 0.5, i: 1, j: 3, dist: 1 },
      { A_i: 'I', A_j: 'A', cn: 0.5, i: 2, j: 1, dist: 1 },
      { A_i: 'T', A_j: 'I', cn: 0.5, i: 3, j: 2, dist: 1 },
      { A_i: 'I', A_j: 'T', cn: 0.5, i: 2, j: 3, dist: 1 },
      { A_i: 'S', A_j: 'A', cn: 0.5, i: 4, j: 1, dist: 1 },
      { A_i: 'T', A_j: 'Y', cn: 0.5, i: 3, j: 5, dist: 1 },
    ];
    result.amendPDBWithCouplingScores(contacts, CONTACT_DISTANCE_PROXIMITY.C_ALPHA);
    const expected = [
      {
        couplingAminoAcid: AminoAcid.Alanine,
        pdbAminoAcid: AminoAcid.Histidine,
        resno: 1,
      },
      {
        couplingAminoAcid: AminoAcid.Isoleucine,
        pdbAminoAcid: AminoAcid.GlutamicAcid,
        resno: 2,
      },
      {
        couplingAminoAcid: AminoAcid.Threonine,
        pdbAminoAcid: AminoAcid.Cysteine,
        resno: 3,
      },
    ];
    expect(result.getResidueNumberingMismatches(new CouplingContainer(mismatchedContacts))).toEqual(expected);
  });

  describe('Residue distances', () => {
    it('Should report the minimum distance between the same residue as 0.', async () => {
      const nglData = await BioblocksPDB.createPDB('sample.pdb');
      expect(nglData.getMinDistBetweenResidues(1, 1).dist).toEqual(0);
    });

    it('Should report the minimum distance between two discrete residues.', async () => {
      const nglData = await BioblocksPDB.createPDB('sample.pdb');
      expect(nglData.getMinDistBetweenResidues(1, 2).dist).toEqual(2);
    });
  });

  describe('Getting a trimmed name', () => {
    it('should trim the last 3 underscores by default.', async () => {
      const result = await BioblocksPDB.createPDB('protein_0_1_2.pdb');
      expect(result.getTrimmedName()).toEqual('protein');
    });

    it('should not trim by default if there are 2 or fewer underscored words.', async () => {
      const result = await BioblocksPDB.createPDB('protein_2_3.pdb');
      expect(result.getTrimmedName()).toEqual('protein_2_3');
    });

    it('should allow trimming the first 3 underscores.', async () => {
      const result = await BioblocksPDB.createPDB('0_1_2_3_protein.pdb');
      expect(result.getTrimmedName('_', 3, 'front')).toEqual('3_protein');
    });

    it('should allow trimming a different character.', async () => {
      const result = await BioblocksPDB.createPDB('protein-0-1-2-3.pdb');
      expect(result.getTrimmedName('-')).toEqual('protein-0');
    });

    it('should allow trimming a different number of words.', async () => {
      const result = await BioblocksPDB.createPDB('protein_0_1_2_3.pdb');
      expect(result.getTrimmedName('_', 2)).toEqual('protein_0_1');
    });

    it('should handle invalid word counts by not trimming.', async () => {
      const result = await BioblocksPDB.createPDB('protein_0_1_2_3.pdb');
      expect(result.getTrimmedName('_', -1)).toEqual('protein_0_1_2_3');
      expect(result.getTrimmedName('_', 10)).toEqual('protein_0_1_2_3');
    });
  });
});
