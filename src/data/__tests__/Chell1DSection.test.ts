import { Chell1DSection } from '../Chell1DSection';

describe('Chell1DSection', () => {
  it('Should allow a section to be created with a given start and end.', () => {
    const result = new Chell1DSection('Gorillaz', 1, 3);
    expect(result.start).toEqual(1);
    expect(result.end).toEqual(3);
    expect(result.length).toEqual(3);
    expect(result.label).toEqual('Gorillaz');
  });

  it('Should allow a section to be created when just given a start.', () => {
    const result = new Chell1DSection('Billy Joel', 3);
    expect(result.start).toEqual(3);
    expect(result.end).toEqual(3);
    expect(result.length).toEqual(1);
    expect(result.label).toEqual('Billy Joel');
  });

  it('Should allow the start of a section to be updated.', () => {
    const result = new Chell1DSection('Daft Punk', 4, 5);
    result.updateStart(1);
    expect(result.start).toEqual(1);
    expect(result.end).toEqual(5);
    expect(result.length).toEqual(5);
  });

  it('Should allow the end of a section to be updated.', () => {
    const result = new Chell1DSection('Daft Punk', 3, 7);
    result.updateEnd(5);
    expect(result.start).toEqual(3);
    expect(result.end).toEqual(5);
    expect(result.length).toEqual(3);
  });

  it('Should automatically fix negative ranges to be positive.', () => {
    const result = new Chell1DSection('Daft Punk', 7, 3);
    expect(result.start).toEqual(3);
    expect(result.end).toEqual(7);
    expect(result.length).toEqual(5);

    result.updateEnd(1);
    expect(result.start).toBe(1);
    expect(result.end).toBe(3);
    expect(result.length).toBe(3);

    result.updateStart(10);
    expect(result.start).toBe(3);
    expect(result.end).toBe(10);
    expect(result.length).toBe(8);
  });

  it('Should allow for determining if a number is within the section range.', () => {
    const result = new Chell1DSection('Nirvana', 3, 7);

    expect(result.contains(2)).toEqual(false);
    expect(result.contains(3)).toEqual(true);
    expect(result.contains(5)).toEqual(true);
    expect(result.contains(7)).toEqual(true);
    expect(result.contains(8)).toEqual(false);
  });
});
