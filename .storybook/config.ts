import { Options as InfoOptions, withInfo } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';
import { addDecorator, configure } from '@storybook/react';

// tslint:disable:no-import-side-effect no-relative-imports no-submodule-imports
// @ts-ignore
import '../assets/semantic.flat.min.css';
import { withProvider } from './decorators';
// tslint:enable:no-import-side-effect no-relative-imports

function loadStories() {
  const req = require.context('../docs/stories/visualizations/', true, /\.stories\.(ts|js|md)x$/);
  req.keys().forEach(req);
}
const infoParameters: InfoOptions = {
  header: false,
  inline: true,
};

addDecorator(withKnobs);
addDecorator((storyFn, context) => withInfo(infoParameters)(storyFn)(context));
addDecorator(withProvider);

/*
addParameters({
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
  options: {
    panelPosition: 'right',
  },
});
*/

configure(loadStories, module);
