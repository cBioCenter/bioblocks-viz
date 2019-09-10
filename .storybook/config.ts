import { withInfo } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';
import { addDecorator, configure } from '@storybook/react';

function loadStories() {
  const req = require.context('../docs/stories', true, /\.tsx$/);
  req.keys().forEach(req);
}

addDecorator(withKnobs);
addDecorator(withInfo);
configure(loadStories, module);
