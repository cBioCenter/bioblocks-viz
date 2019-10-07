import { withKnobs } from '@storybook/addon-knobs';
import { addDecorator, addParameters, configure } from '@storybook/react';
import { themes } from '@storybook/theming';

// tslint:disable:no-import-side-effect no-relative-imports no-submodule-imports
// @ts-ignore
import { DocsContainer, DocsPage } from '@storybook/addon-docs/blocks';

import '../assets/semantic.flat.min.css';
import { withProvider } from './decorators';
// tslint:enable:no-import-side-effect no-relative-imports  no-submodule-imports

function loadStories() {
  const req = require.context('../docs/stories/visualizations/', true, /\.stories\.(ts|js|md)x$/);

  return req
    .keys()
    .map(req)
    .filter(exp => (exp as any).default as boolean);
}

addDecorator(withKnobs);
addDecorator(withProvider);

addParameters({
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
  options: {
    panelPosition: 'bottom',
    theme: themes.dark,
  },
});

configure(loadStories, module);
