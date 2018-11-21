import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ChellVizApp as App } from '~chell-viz~';

ReactDOM.render(<App />, document.getElementById('app-root'));

/*
const style: React.CSSProperties = {
  color: 'red',
};

const expandedStyle = `
  .expandedOld {
  background-color: green;
  border: 5px solid red;
  bottom: 0;
  height: 100vh;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: 100vw;
  z-index: 1000000;
}
.expanded {
  background-color: green;
  border: 5px solid red;
  bottom: 0;
  height: 100%;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 1000000;
}
`;

ReactDOM.render(
  <>
    <style>{expandedStyle}</style>
    <div className="ui three column doubling stackable grid" style={{ ...style }}>
      <div className="column" style={{}}>
        <div className="ui segment" style={{}}>
          <div style={{ position: 'unset' }}>
            <div className="">
              Content 1<button onClick={e => (e.currentTarget!.parentElement!.className = 'expanded')}>expand</button>{' '}
              <button onClick={e => (e.currentTarget!.parentElement!.className = '')}>contract</button>
            </div>
          </div>
        </div>
      </div>
      <div className="column">
        <div className="ui segment">
          Content 2 <button>expand</button> <button>contract</button>
        </div>
      </div>
      <div className="column">
        <div className="ui segment">
          Content 3 <button>expand</button> <button>contract</button>
        </div>
      </div>
      <div className="column">
        <div className="ui segment">
          Content 4 <button>expand</button> <button>contract</button>
        </div>
      </div>
      <div className="column">
        <div className="ui segment">
          Content 5 <button>expand</button> <button>contract</button>
        </div>
      </div>
      <div className="column">
        <div className="ui segment">
          Content 6 <button>expand</button> <button>contract</button>
        </div>
      </div>
    </div>
  </>,
  document.getElementById('app-root'),
);
*/

if (module.hot) {
  module.hot.accept();
}
