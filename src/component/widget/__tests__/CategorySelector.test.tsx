import { mount, shallow } from 'enzyme';
import * as React from 'react';
import { Dropdown, DropdownItem } from 'semantic-ui-react';

import { CategorySelector } from '~chell-viz~/component';

describe('CategorySelector', () => {
  const categories = [
    'Costello Music',
    'Here We Stand',
    'We Need Medicine',
    'Eyes Wide, Tongue Tied',
    'In Your Own Sweet Time',
  ];

  it('Should match existing snapshot when given simple data.', () => {
    const selectorWrapper = shallow(<CategorySelector categories={categories} />);
    expect(selectorWrapper).toMatchSnapshot();
  });

  it('Should invoke callback if provided when category is selected', () => {
    const onCategoryChangeSpy = jest.fn();
    const selectorWrapper = mount(<CategorySelector categories={categories} onCategoryChange={onCategoryChangeSpy} />);

    const selectionIndex = categories.indexOf('Here We Stand');
    selectorWrapper.find(Dropdown).simulate('click');
    selectorWrapper
      .find(DropdownItem)
      .at(selectionIndex)
      .simulate('click');
    expect(onCategoryChangeSpy).toHaveBeenCalled();
  });
});
