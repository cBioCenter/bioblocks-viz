import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as React from 'react';

import { CategorySelector } from '../CategorySelector';

describe('CategorySelector', () => {
  test('Should match existing snapshot when given simple data.', () => {
    const selectorWrapper = shallow(<CategorySelector categories={['Babydoll']} />);
    expect(toJson(selectorWrapper)).toMatchSnapshot();
  });
});
