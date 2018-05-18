import { generatePointCloudData, generateScatterGLData } from '../PlotlyHelper';

describe('generateScatterGLData', () => {
  const sampleInput = {
    color: 'blue',
    name: 'da-bo-dee',
    points: [
      {
        i: 9,
        j: 8,
      },
      { i: 7, j: 6 },
    ],
  };

  test('Should create the expected plotly scatter data format when given defaults.', () => {
    const result = generateScatterGLData(sampleInput, 4);
    expect(result).toMatchSnapshot();
  });

  test('Should create the expected plotly scatter data format when points are mirrored.', () => {
    const result = generateScatterGLData(sampleInput, 4);
    expect(result.x).toEqual([9, 7]);
    expect(result.y).toEqual([8, 6]);
  });
});

describe('generatePointCloudData', () => {
  const sampleInput = {
    color: 'blue',
    name: 'da-bo-dai',
    points: [
      {
        i: 1,
        j: 2,
      },
      { i: 3, j: 4 },
    ],
  };

  test('Should create the expected plotly point cloud data format when given defaults.', () => {
    const result = generatePointCloudData(sampleInput, 4);
    expect(result).toMatchSnapshot();
  });

  test('Should create the expected plotly point cloud data format when points are mirrored.', () => {
    const result = generatePointCloudData(sampleInput, 4, true);
    const expected = new Float32Array([1, 2, 3, 4, 4, 3, 2, 1]);
    expect(result.xy).toEqual(expected);
  });
});
