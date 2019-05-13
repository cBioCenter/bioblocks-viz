import { AuxiliaryAxis } from '~bioblocks-viz~/component';
import { Bioblocks1DSection } from '~bioblocks-viz~/data';
import { ColorMapper } from '~bioblocks-viz~/helper';

describe('AuxiliaryAxis', () => {
  let sampleSections: Array<Bioblocks1DSection<string>>;
  beforeEach(() => {
    sampleSections = [new Bioblocks1DSection('kanto', 1, 151), new Bioblocks1DSection('johto', 152, 251)];
  });

  it('Should allow passing a specific axis index.', () => {
    const result = new AuxiliaryAxis(sampleSections, 4);
    expect(result.axisIndex).toEqual(4);
  });

  it('Should allow a data transform function to be run on each section.', () => {
    const dataTransformSpy = {
      johto: jest.fn(() => ({ main: 0, opposite: 0 })),
      kanto: jest.fn(() => ({ main: 0, opposite: 0 })),
    };
    const result = new AuxiliaryAxis(sampleSections, 0, new ColorMapper(), dataTransformSpy);
    expect(result.axis.size).toEqual(2);
    expect(dataTransformSpy.johto).toHaveBeenCalled();
    expect(dataTransformSpy.kanto).toHaveBeenCalled();
  });

  it('Should allow a filter function to determine if a section gets transformed.', () => {
    const filterSpy = jest.fn();
    const result = new AuxiliaryAxis(sampleSections, 0, new ColorMapper(), undefined, filterSpy);
    expect(result.axis.size).toEqual(2);
    expect(filterSpy).toHaveBeenCalledTimes(2);
  });

  it('Should allow a filter function that can disable the transform function on certain sections.', () => {
    const dataTransformSpy = {
      johto: jest.fn(() => ({ main: 0, opposite: 0 })),
      kanto: jest.fn(),
    };
    const filterSpy = jest.fn((section: Bioblocks1DSection<string>) => section.label === 'kanto');
    const result = new AuxiliaryAxis(sampleSections, 0, new ColorMapper(), dataTransformSpy, filterSpy);
    expect(result.axis.size).toEqual(1);
    expect(filterSpy).toHaveBeenCalled();
    expect(dataTransformSpy.johto).toHaveBeenCalled();
    expect(dataTransformSpy.kanto).not.toHaveBeenCalled();
  });

  it('Should allow a color map to color specific sections.', () => {
    const colorMap = new ColorMapper(new Map([['johto', 'gold'], ['kanto', 'red']]));
    const result = new AuxiliaryAxis([...sampleSections, new Bioblocks1DSection('unova', 494, 649)], 0, colorMap);
    expect(result.axis.size).toEqual(3);

    const johtoAxis = result.getAxisById('johto');
    const kantoAxis = result.getAxisById('kanto');
    const unovaAxis = result.getAxisById('unova');

    if (!johtoAxis || !kantoAxis || !unovaAxis) {
      expect(johtoAxis).not.toBeUndefined();
      expect(kantoAxis).not.toBeUndefined();
      expect(unovaAxis).not.toBeUndefined();
    } else {
      expect(johtoAxis.x.line && johtoAxis.x.line.color).toEqual('gold');
      expect(kantoAxis.x.line && kantoAxis.x.line.color).toEqual('red');
      expect(unovaAxis.x.line && unovaAxis.x.line.color).toEqual('black');
    }
  });
});
