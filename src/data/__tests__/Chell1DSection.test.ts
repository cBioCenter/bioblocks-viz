import { Chell1DSection } from '../Chell1DSection';

describe('Chell1DSection', () => {
  it('Should allow a section to be created with a given start and end.', () => {
    const result = new Chell1DSection('Gorillaz', 1, 3);
    expect(result.section.start).toEqual(1);
    expect(result.section.end).toEqual(3);
    expect(result.section.length).toEqual(3);
    expect(result.section.label).toEqual('Gorillaz');
  });

  it('Should allow a section to be created when just given a start.', () => {
    const result = new Chell1DSection('Billy Joel', 3);
    expect(result.section.start).toEqual(3);
    expect(result.section.end).toEqual(3);
    expect(result.section.length).toEqual(1);
    expect(result.section.label).toEqual('Billy Joel');
  });

  it('Should allow the start of a section to be updated.', () => {
    const result = new Chell1DSection('Daft Punk', 4, 5);
    result.updateStart(1);
    expect(result.section.start).toEqual(1);
    expect(result.section.end).toEqual(5);
    expect(result.section.length).toEqual(5);
  });

  it('Should allow the end of a section to be updated.', () => {
    const result = new Chell1DSection('Daft Punk', 3, 7);
    result.updateEnd(5);
    expect(result.section.start).toEqual(3);
    expect(result.section.end).toEqual(5);
    expect(result.section.length).toEqual(3);
  });

  it('Should automatically fix negative ranges to be positive.', () => {
    const result = new Chell1DSection('Daft Punk', 7, 3);
    expect(result.section.start).toEqual(3);
    expect(result.section.end).toEqual(7);
    expect(result.section.length).toEqual(5);

    result.updateEnd(1);
    expect(result.section.start).toBe(1);
    expect(result.section.end).toBe(3);
    expect(result.section.length).toBe(3);

    result.updateStart(10);
    expect(result.section.start).toBe(3);
    expect(result.section.end).toBe(10);
    expect(result.section.length).toBe(8);
  });
});
