import * as React from 'react';
import { Provider } from 'react-redux';
import { BBStore } from '~bioblocks-viz~/reducer';

// tslint:disable-next-line: export-name
export const withProvider = (story: () => React.ReactElement) => <Provider store={BBStore}>{story()}</Provider>;
