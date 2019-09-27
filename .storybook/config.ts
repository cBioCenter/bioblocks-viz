import { withKnobs } from '@storybook/addon-knobs';
import { addDecorator, addParameters, configure } from '@storybook/react';

// tslint:disable:no-import-side-effect no-relative-imports no-submodule-imports
// @ts-ignore
import { DocsContainer, DocsPage } from '@storybook/addon-docs/blocks';
import '../assets/semantic.flat.min.css';
import { withProvider } from './decorators';
// tslint:enable:no-import-side-effect no-relative-imports

function loadStories() {
  const req = require.context('../docs/stories/visualizations/', true, /\ContactMap.stories\.(ts|js|md)x$/);
  req.keys().forEach(req);
}

addDecorator(withKnobs);
// addDecorator(withInfo(infoParameters));
addDecorator(withProvider);
addParameters({
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
  options: {
    panelPosition: 'right',
  },
});
configure(loadStories, module);
