import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { ProteinViewer } from '../ProteinViewer';

describe('ProteinViewer', () => {
  test('Should match existing snapshot when given no data.', () => {
    expect(toJson(shallow(<ProteinViewer />))).toMatchSnapshot();
  });
});
