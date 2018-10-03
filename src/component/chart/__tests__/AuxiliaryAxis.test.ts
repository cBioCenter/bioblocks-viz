import { AuxiliaryAxis } from '~chell-viz~/component';
import { Chell1DSection } from '~chell-viz~/data';

describe('AuxiliaryAxis', () => {
  const sampleSections = [new Chell1DSection('kanto', 1, 151), new Chell1DSection('johto', 152, 251)];

  it('Should allow passing a specific axis index.', () => {
    const result = new AuxiliaryAxis(sampleSections, 4);
    expect(result.axisIndex).toEqual(4);
  });

  it('Should allow a data transform function to be run on each section.', () => {
    const dataTransformSpy = {
      johto: jest.fn(() => ({ main: 0, opposite: 0 })),
      kanto: jest.fn(() => ({ main: 0, opposite: 0 })),
    };
    const result = new AuxiliaryAxis(sampleSections, 0, 'black', {}, dataTransformSpy);
    expect(result.axis.size).toEqual(2);
    expect(dataTransformSpy.johto).toHaveBeenCalled();
    expect(dataTransformSpy.kanto).toHaveBeenCalled();
  });

  it('Should allow a filter function to determine if a section gets transformed.', () => {
    const filterSpy = jest.fn();
    const result = new AuxiliaryAxis(sampleSections, 0, 'black', {}, undefined, filterSpy);
    expect(result.axis.size).toEqual(2);
    expect(filterSpy).toHaveBeenCalledTimes(2);
  });

  it('Should allow a filter function that can disable the transform function on certain sections.', () => {
    const dataTransformSpy = {
      johto: jest.fn(() => ({ main: 0, opposite: 0 })),
      kanto: jest.fn(),
    };
    const filterSpy = jest.fn((section: Chell1DSection<string>) => section.label === 'kanto');
    const result = new AuxiliaryAxis(sampleSections, 0, 'black', {}, dataTransformSpy, filterSpy);
    expect(result.axis.size).toEqual(1);
    expect(filterSpy).toHaveBeenCalled();
    expect(dataTransformSpy.johto).toHaveBeenCalled();
    expect(dataTransformSpy.kanto).not.toHaveBeenCalled();
  });

  it('Should allow a color map to color specific sections.', () => {
    const colorMap = {
      johto: 'gold',
      kanto: 'red',
    };
    const result = new AuxiliaryAxis([...sampleSections, new Chell1DSection('unova', 494, 649)], 0, 'black', colorMap);
    expect(result.axis.size).toEqual(3);

    expect(result.axis.get('johto')).not.toBeUndefined();
    expect(result.axis.get('kanto')).not.toBeUndefined();
    expect(result.axis.get('unova')).not.toBeUndefined();

    expect(result.axis.get('johto')!.x.line!.color).toEqual('gold');
    expect(result.axis.get('kanto')!.x.line!.color).toEqual('red');
    expect(result.axis.get('unova')!.x.line!.color).toEqual('black');
  });
});
