import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { SequenceViewer } from '../SequenceViewer';

describe('SequenceViewer', () => {
  test('Should match existing snapshot when given no data.', () => {
    expect(toJson(shallow(<SequenceViewer />))).toMatchSnapshot();
  });
});
