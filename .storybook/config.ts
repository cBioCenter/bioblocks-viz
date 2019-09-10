import { configure } from '@storybook/react';

function loadStories() {
  const req = require.context('../docs/stories', true, /\.tsx$/);
  req.keys().forEach(req);
}

configure(loadStories, module);
