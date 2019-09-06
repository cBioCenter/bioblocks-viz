import { shallow } from 'enzyme';
import * as React from 'react';

import { ICategoricalAnnotation } from '~bioblocks-viz~/component';
import { UMAPTranscriptionalContainer } from '~bioblocks-viz~/container';

describe('UMAPTranscriptionalContainer', () => {
  let categoricalAnnotations: ICategoricalAnnotation = {};
  let dataMatrix: number[][] = [[]];
  beforeEach(() => {
    categoricalAnnotations = {
      banjo: {
        label_colors: {
          bear: 'brown',
          bird: 'red',
        },
        label_list: ['bear', 'bird'],
      },
    };
    dataMatrix = [[1, 2, 3], [4, 5, 6]];
  });

  it('Should render when given an empty data matrix.', () => {
    const wrapper = shallow(<UMAPTranscriptionalContainer dataMatrix={[[]]} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should render labels.', async () => {
    const wrapper = shallow(
      <UMAPTranscriptionalContainer
        categoricalAnnotations={categoricalAnnotations}
        dataMatrix={dataMatrix}
        labelCategory={'banjo'}
      />,
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('Should generate colors if none are provided.', async () => {
    const wrapper = shallow(
      <UMAPTranscriptionalContainer
        categoricalAnnotations={{
          banjo: {
            ...categoricalAnnotations.banjo,
            label_colors: {},
          },
        }}
        dataMatrix={dataMatrix}
        labelCategory={'banjo'}
      />,
    );
    const instance = wrapper.instance() as UMAPTranscriptionalContainer;
    const expected = {
      banjo: [{ color: '#66c2a5', name: 'bear' }, { color: '#fc8d62', name: 'bird' }],
    };

    expect(instance.state.completeSampleAnnotations).toEqual(expected);
  });
});
