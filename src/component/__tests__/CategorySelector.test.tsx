import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as React from 'react';

import { Dropdown, DropdownItem } from 'semantic-ui-react';
import CategorySelector from '../CategorySelector';

describe('CategorySelector', () => {
  const categories = [
    'Costello Music',
    'Here We Stand',
    'We Need Medicine',
    'Eyes Wide, Tongue Tied',
    'In Your Own Sweet Time',
  ];

  test('Should match existing snapshot when given simple data.', () => {
    const selectorWrapper = shallow(<CategorySelector categories={categories} />);
    expect(toJson(selectorWrapper)).toMatchSnapshot();
  });

  test('Should invoke callback if provided when category is selected', () => {
    const onCategoryChangeSpy = jest.fn();
    const selectorWrapper = mount(<CategorySelector categories={categories} onCategoryChange={onCategoryChangeSpy} />);

    const selectionIndex = 5;
    selectorWrapper.find(Dropdown).simulate('click');
    selectorWrapper
      .find(DropdownItem)
      .at(selectionIndex)
      .simulate('click');
    expect(onCategoryChangeSpy).toHaveBeenCalled();
  });
});
