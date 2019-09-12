import { Options as InfoOptions, withInfo } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';
import { addDecorator, addParameters, configure } from '@storybook/react';

// tslint:disable-next-line:no-import-side-effect no-relative-imports
import '../assets/semantic.flat.min.css';

function loadStories() {
  const req = require.context('../docs/stories', true, /\.tsx$/);
  req.keys().forEach(req);
}

const infoParameters: InfoOptions = {
  header: false,
  inline: true,
};

addDecorator(withKnobs);
addDecorator(withInfo(infoParameters));

configure(loadStories, module);
