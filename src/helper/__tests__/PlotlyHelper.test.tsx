import { ICouplingScore } from '~bioblocks-viz~/data';
import { generateCouplingScoreHoverText, generatePointCloudData, generateScatterGLData } from '~bioblocks-viz~/helper';

describe('generateScatterGLData', () => {
  const sampleInput = {
    marker: {
      color: 'blue',
    },
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
    expect(result.z).toEqual([6, 2, 6, 2]);
    expect(result.text).toEqual([]);
  });

  it('Should create the expected plotly scatter data format when points are mirrored and dist is not provided.', () => {
    const result = generateScatterGLData({ ...sampleInput, points: [{ i: 9, j: 8 }, { i: 7, j: 6 }] }, true);
    expect(result.x).toEqual([9, 7, 8, 6]);
    expect(result.y).toEqual([8, 6, 9, 7]);
    expect(result.z).toEqual([-1, -1, -1, -1]);
    expect(result.text).toEqual([]);
  });

  it('Should create the expected text for the plotly scatter data when points are mirrored.', () => {
    let result = generateScatterGLData({ ...sampleInput, text: 'demon' }, true);
    expect(result.text).toEqual(['demon', 'demon']);

    result = generateScatterGLData({ ...sampleInput, text: ['summer', 'highland'] }, true);
    expect(result.text).toEqual(['summer', 'highland', 'summer', 'highland']);

    result = generateScatterGLData({ ...sampleInput, text: ['(1, 2)<br>text', '(3, 4)<br>text'] }, true);
    expect(result.text).toEqual(['(1, 2)<br>text', '(3, 4)<br>text', '(2, 1)<br>text', '(4, 3)<br>text']);
  });

  it('Should create the expected text for the plotly scatter data when points are not mirrored.', () => {
    let result = generateScatterGLData({ ...sampleInput, text: 'demon' }, false);
    expect(result.text).toEqual(['demon']);

    result = generateScatterGLData({ ...sampleInput, text: ['summer', 'highland'] }, false);
    expect(result.text).toEqual(['summer', 'highland']);

    result = generateScatterGLData({ ...sampleInput, text: ['(1, 2)<br>text', '(3, 4)<br>text'] }, false);
    expect(result.text).toEqual(['(1, 2)<br>text', '(3, 4)<br>text']);
  });

  it('Should use z values for color when points are not mirrored and no explicit color is provided.', () => {
    const result = generateScatterGLData({ ...sampleInput, marker: {} }, false);
    expect(result.marker && result.marker.color).toEqual(['6', '2']);
  });

  it('Should create the expected text for a coupling score.', () => {
    const score: ICouplingScore = {
      i: 1,
      j: 2,
    };
    expect(generateCouplingScoreHoverText(score)).toEqual('(1, 2)');

    score.A_i = 'A';
    score.A_j = 'M';
    expect(generateCouplingScoreHoverText(score)).toEqual('(1A, 2M)');

    score.probability = 0.9;
    expect(generateCouplingScoreHoverText(score)).toEqual('(1A, 2M)<br>Probability: 0.9');

    score.probability = undefined;
    score.score = 300;
    expect(generateCouplingScoreHoverText(score)).toEqual('(1A, 2M)<br>Score: 300');

    score.probability = 0.9;
    expect(generateCouplingScoreHoverText(score)).toEqual('(1A, 2M)<br>Score: 300<br>Probability: 0.9');
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
