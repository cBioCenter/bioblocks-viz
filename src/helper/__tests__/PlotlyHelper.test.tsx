import { generatePointCloudData, generateScatterGLData } from '../PlotlyHelper';

describe('generateScatterGLData', () => {
  const sampleInput = {
    color: 'blue',
    name: 'da-bo-dee',
    nodeSize: 4,
    points: [
      {
        dist: 6,
        i: 9,
        j: 8,
      },
      { dist: 2, i: 7, j: 6 },
    ],
  };

  it('Should create the expected plotly scatter data format when given defaults.', () => {
    const result = generateScatterGLData(sampleInput, false);
    expect(result).toMatchSnapshot();
  });

  it('Should create the expected plotly scatter data format when points are mirrored.', () => {
    const result = generateScatterGLData(sampleInput, true);
    expect(result.x).toEqual([9, 7, 8, 6]);
    expect(result.y).toEqual([8, 6, 9, 7]);
  });
});

describe('generatePointCloudData', () => {
  const sampleInput = {
    color: 'blue',
    name: 'da-bo-dai',
    nodeSize: 5,
    points: [
      {
        dist: 4,
        i: 1,
        j: 2,
      },
      { dist: 5, i: 3, j: 4 },
    ],
  };

  it('Should create the expected plotly point cloud data format when given defaults.', () => {
    const result = generatePointCloudData(sampleInput, false);
    expect(result).toMatchSnapshot();
  });

  it('Should create the expected plotly point cloud data format when points are mirrored.', () => {
    const result = generatePointCloudData(sampleInput, true);
    const expected = new Float32Array([1, 2, 3, 4, 4, 3, 2, 1]);
    expect(result.xy).toEqual(expected);
  });
});
