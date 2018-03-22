import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { ChellSlider } from '../ChellSlider';

describe('ChellSlider', () => {
  test('Should match existing snapshot when given simple data.', () => {
    const chellSliderWrapper = shallow(<ChellSlider defaultValue={10} max={100} min={1} label={'test'} />);
    expect(toJson(chellSliderWrapper)).toMatchSnapshot();
  });
});
