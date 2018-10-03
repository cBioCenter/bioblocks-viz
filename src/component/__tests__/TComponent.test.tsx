import { shallow } from 'enzyme';
import * as React from 'react';

import { TComponent } from '~chell-viz~/component';

describe('TComponent', () => {
  it('Should match existing snapshot when given simple data.', () => {
    const data = [[1, 2], [3, 4], [5, 6]];
    expect(shallow(<TComponent data={data} />)).toMatchSnapshot();
  });
});
