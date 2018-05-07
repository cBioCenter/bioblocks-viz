import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as React from 'react';
import * as Renderer from 'react-test-renderer';

import ContactMap from '../ContactMap';

describe('ContactMap', () => {
  const emptyData = {
    contactMonomer: [],
    couplingScore: [],
    distanceMapMonomer: [],
  };

  const sampleData = {
    contactMonomer: [{ i: 0, j: 1, dist: 10 }, { i: 1, j: 0, dist: 10 }],
    couplingScore: [
      {
        i: 0,
        // tslint:disable-next-line:object-literal-sort-keys
        A_i: 'I',
        j: 1,
        A_j: 'J',
        fn: 1,
        cn: 1,
        segment_i: 'K',
        segment_j: 'L',
        probability: 1,
        dist_intra: 1,
        dist_multimer: 1,
        dist: 10,
        precision: 10,
      },
    ],
    distanceMapMonomer: [{ id: 0, sec_struct_3state: 'A' }],
  };

  test('Should match existing snapshot when given no data.', () => {
    expect(toJson(shallow(<ContactMap />))).toMatchSnapshot();
  });

  test('Should match existing snapshot when given empty data.', () => {
    expect(toJson(shallow(<ContactMap data={emptyData} />))).toMatchSnapshot();
  });

  test('Should match existing snapshot when given sample data and sliders are _not_ enabled.', () => {
    const component = Renderer.create(<ContactMap data={sampleData} enableSliders={false} />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  test('Should match existing snapshot when given sample data and sliders are enabled.', () => {
    const component = Renderer.create(<ContactMap data={sampleData} enableSliders={true} />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
