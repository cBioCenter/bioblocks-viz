import { RenderFunction } from '@storybook/react';
import * as React from 'react';
import { Provider } from 'react-redux';
import { BBStore } from '~bioblocks-viz~/reducer';

// tslint:disable-next-line: export-name
export const withProvider = (story: RenderFunction) => <Provider store={BBStore}>{story()}</Provider>;
